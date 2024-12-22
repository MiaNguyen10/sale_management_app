const db = require("../config/db");
const { get } = require("../routes/discountRoutes");
const sql = db.sql;

const Order = {
  /**
   * Create a new order with products and discounts in a single transaction
   */
  createCompleteOrder: async (organizationId, orderDate, items, discounts) => {
    const pool = await db.poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Create order
      const orderResult = await transaction
        .request()
        .input("OrganizationID", sql.Int, organizationId)
        .input("OrderDate", sql.DateTime, orderDate).query(`
              INSERT INTO Orders (OrganizationID, OrderDate, TotalAmount, DiscountAmount, FinalAmount)
              VALUES (@OrganizationID, @OrderDate, 0, 0, 0);
              SELECT SCOPE_IDENTITY() AS OrderID;
            `);

      const orderId = orderResult.recordset[0].OrderID;

      // Add order items
      const itemsTable = new sql.Table("OrderItems");
      itemsTable.create = false;
      itemsTable.columns.add("OrderID", sql.Int, { nullable: false });
      itemsTable.columns.add("ProductID", sql.Int, { nullable: false });
      itemsTable.columns.add("Quantity", sql.Int, { nullable: false });
      itemsTable.columns.add("UnitPrice", sql.Decimal(18, 2), {
        nullable: false,
      });
      itemsTable.columns.add("TotalPrice", sql.Decimal(29, 2), {
        nullable: false,
      });
      itemsTable.columns.add("DiscountApplied", sql.Decimal(18, 2), {
        nullable: true,
      });
      itemsTable.columns.add("FinalPrice", sql.Decimal(30, 2), {
        nullable: false,
      });

      // Validate products and stock before adding
      for (const item of items) {
        const productResult = await transaction
          .request()
          .input("ProductID", sql.Int, item.ProductID)
          .input("OrganizationID", sql.Int, organizationId).query(`
                SELECT Price, StockQuantity 
                FROM Products 
                WHERE ProductID = @ProductID 
                AND OrganizationID = @OrganizationID
              `);

        if (!productResult.recordset[0]) {
          throw new Error(
            `Product ${item.ProductID} not found or not associated with organization`
          );
        }

        const product = productResult.recordset[0];
        if (product.StockQuantity < item.Quantity) {
          throw new Error(`Insufficient stock for product ${item.ProductID}`);
        }

        const totalPrice = item.Quantity * product.Price;
        const discountAmount = item.DiscountedPrice
          ? totalPrice - item.Quantity * item.DiscountedPrice
          : 0;
        const finalPrice = totalPrice - discountAmount;

        itemsTable.rows.add(
          orderId,
          item.ProductID,
          item.Quantity,
          product.Price,
          totalPrice,
          discountAmount,
          finalPrice
        );

        // Update stock quantity
        await transaction
          .request()
          .input("ProductID", sql.Int, item.ProductID)
          .input("Quantity", sql.Int, item.Quantity).query(`
                UPDATE Products 
                SET StockQuantity = StockQuantity - @Quantity 
                WHERE ProductID = @ProductID
              `);
      }

      await transaction.request().bulk(itemsTable);

      // Apply order-level discounts
      if (discounts && discounts.length > 0) {
        const discountTable = new sql.Table("OrderDiscounts");
        discountTable.create = false;
        discountTable.columns.add("OrderID", sql.Int, { nullable: false });
        discountTable.columns.add("DiscountID", sql.Int, { nullable: false });

        // Validate discounts
        for (const discount of discounts) {
          const discountResult = await transaction
            .request()
            .input("DiscountID", sql.Int, discount.DiscountID)
            .input("OrganizationID", sql.Int, organizationId).query(`
                  SELECT * FROM Discounts 
                  WHERE DiscountID = @DiscountID 
                  AND OrganizationID = @OrganizationID 
                  AND StartDate <= GETDATE() 
                  AND EndDate >= GETDATE()
                `);

          if (!discountResult.recordset[0]) {
            throw new Error(
              `Discount ${discount.DiscountID} is not valid or has expired`
            );
          }

          discountTable.rows.add(orderId, discount.DiscountID);
        }

        await transaction.request().bulk(discountTable);
      }

      // Calculate final amounts with both fixed and percentage discounts
      await transaction.request().input("OrderID", sql.Int, orderId).query(`
          DECLARE @TotalBeforeDiscount DECIMAL(29,2);
          DECLARE @ItemDiscounts DECIMAL(18,2);
          DECLARE @FixedOrderDiscounts DECIMAL(18,2);
          DECLARE @PercentageOrderDiscounts DECIMAL(18,2);
          DECLARE @TotalDiscounts DECIMAL(18,2);
          DECLARE @FinalAmount DECIMAL(30,2);

          -- Get total amount before any discounts
          SELECT @TotalBeforeDiscount = SUM(TotalPrice)
          FROM OrderItems
          WHERE OrderID = @OrderID;

          -- Get sum of item-level discounts
          SELECT @ItemDiscounts = COALESCE(SUM(DiscountApplied), 0)
          FROM OrderItems
          WHERE OrderID = @OrderID;

          -- Calculate fixed amount discounts
          SELECT @FixedOrderDiscounts = COALESCE(SUM(d.DiscountValue), 0)
          FROM OrderDiscounts od
          JOIN Discounts d ON od.DiscountID = d.DiscountID
          WHERE od.OrderID = @OrderID
          AND d.DiscountType = 1; -- Fixed amount

          -- Calculate percentage-based discounts
          -- Apply percentages to remaining amount after fixed discounts
          SELECT @PercentageOrderDiscounts = COALESCE(
            SUM(
              (@TotalBeforeDiscount - @ItemDiscounts - @FixedOrderDiscounts) 
              * (d.DiscountValue / 100.0)
            ), 
            0
          )
          FROM OrderDiscounts od
          JOIN Discounts d ON od.DiscountID = d.DiscountID
          WHERE od.OrderID = @OrderID
          AND d.DiscountType = 2; -- Percentage

          -- Calculate total discounts
          SET @TotalDiscounts = @ItemDiscounts + @FixedOrderDiscounts + @PercentageOrderDiscounts;
          
          -- Calculate final amount
          SET @FinalAmount = @TotalBeforeDiscount - @TotalDiscounts;

          -- Update order with calculated values
          UPDATE Orders
          SET 
            TotalAmount = @TotalBeforeDiscount,
            DiscountAmount = @TotalDiscounts,
            FinalAmount = @FinalAmount
          WHERE OrderID = @OrderID;
        `);

      await transaction.commit();
      return orderId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Get order list by organization ID.
   */
  getOrdersByOrganization: async (organization_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id).query(`
            SELECT * FROM Orders WHERE OrganizationID = @OrganizationID
            `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get order list by organization and date range.
   */
  getOrdersByOrganizationAndDateRange: async (
    organization_id,
    order_date_start,
    order_date_end
  ) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool
        .request()
        .input("OrganizationID", sql.Int, organization_id)
        .input("OrderDateStart", sql.DateTime, order_date_start)
        .input("OrderDateEnd", sql.DateTime, order_date_end).query(`
            SELECT * FROM Orders WHERE OrganizationID = @OrganizationID AND OrderDate BETWEEN @OrderDateStart AND @OrderDateEnd
            `);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Get order details by order ID.
   */
  getOrderDetail: async (order_id) => {
    try {
      const pool = await db.poolPromise;
      const result = await pool.request().input("OrderID", sql.Int, order_id)
        .query(`
          DECLARE @TotalBeforeDiscount DECIMAL(29,2);
          DECLARE @ItemDiscounts DECIMAL(18,2);
          DECLARE @FixedOrderDiscounts DECIMAL(18,2);
          DECLARE @PercentageOrderDiscounts DECIMAL(18,2);
          DECLARE @OrderID INT = @OrderID;

          -- Get total amount before any discounts
          SELECT @TotalBeforeDiscount = SUM(TotalPrice)
          FROM OrderItems
          WHERE OrderID = @OrderID;

          -- Get sum of item-level discounts
          SELECT @ItemDiscounts = COALESCE(SUM(DiscountApplied), 0)
          FROM OrderItems
          WHERE OrderID = @OrderID;

          -- Calculate fixed amount discounts
          SELECT @FixedOrderDiscounts = COALESCE(SUM(d.DiscountValue), 0)
          FROM OrderDiscounts od
          JOIN Discounts d ON od.DiscountID = d.DiscountID
          WHERE od.OrderID = @OrderID
          AND d.DiscountType = 1; -- Fixed amount

          -- Calculate percentage-based discounts
          -- Apply percentages to remaining amount after fixed discounts
          SELECT @PercentageOrderDiscounts = COALESCE(
            SUM(
              (@TotalBeforeDiscount - @ItemDiscounts - @FixedOrderDiscounts) 
              * (d.DiscountValue / 100.0)
            ), 
            0
          )
          FROM OrderDiscounts od
          JOIN Discounts d ON od.DiscountID = d.DiscountID
          WHERE od.OrderID = @OrderID
          AND d.DiscountType = 2; -- Percentage

          -- Select Detail of Order
          SELECT 
            o.OrderID,
            o.OrderDate,
            o.TotalAmount,
            o.DiscountAmount,
            o.FinalAmount,
            
            -- Order Item Details
            oi.OrderItemID,
            oi.ProductID,
            p.Name AS ProductName,
            oi.Quantity,
            oi.UnitPrice,
            oi.TotalPrice,
            -- Product Discount Details
            d.Name AS ProductDiscountName,
            oi.DiscountApplied AS ProductDiscountAmount,
            oi.FinalPrice AS ProductFinalPrice,

            -- Order Discount Details
            od_d.Name AS OrderDiscountName,
            od_d.DiscountType,
            od_d.DiscountValue AS OrderDiscountValue,
            CASE 
              WHEN d.DiscountType = 1 THEN @FixedOrderDiscounts
              WHEN d.DiscountType = 2 THEN @PercentageOrderDiscounts
            END AS DiscountedPrice
          FROM Orders o
          LEFT JOIN OrderItems oi on o.OrderID = oi.OrderID
          LEFT JOIN Products p on oi.ProductID = p.ProductID
          LEFT JOIN DiscountProducts dp on oi.ProductID = dp.ProductID
          LEFT JOIN Discounts d on dp.DiscountID = d.DiscountID AND d.Scope = 1
          LEFT JOIN OrderDiscounts od on o.OrderID = od.OrderID
          LEFT JOIN Discounts od_d on od.DiscountID = od_d.DiscountID AND od_d.Scope = 2
          WHERE o.OrderID = @OrderID
          ORDER BY 
            oi.OrderItemID;
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete an order by order ID.
  */
 deleteOrder: async (order_id) => {
  try {
    const pool = await db.poolPromise;
    const result = await pool.request().input("OrderID", sql.Int, order_id).query(`
        DELETE FROM Orders WHERE OrderID = @OrderID
        `);
    return result.rowsAffected[0];
  } catch (error) {
    throw error;
  }
 },
};

module.exports = Order;
