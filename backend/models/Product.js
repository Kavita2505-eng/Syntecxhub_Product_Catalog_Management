const store = require('./store');

class SingleProductQuery {
  constructor(product) {
    this.product = product ? { ...product } : null;
  }

  /**
   * Mock populate for creator details
   */
  populate(field, selectFields) {
    if (this.product && field === 'createdBy') {
      const creatorId = this.product.createdBy?._id || this.product.createdBy?.toString() || this.product.createdBy;
      const user = store.users.find((u) => u._id === creatorId);
      this.product.createdBy = user
        ? { _id: user._id, username: user.username, email: user.email }
        : null;
    }
    return this;
  }

  /**
   * Thenable interface to allow direct awaiting
   */
  then(resolve, reject) {
    resolve(this.product ? Product.wrap(this.product) : null);
  }
}

class ProductQuery {
  constructor(products) {
    this.results = products.map((p) => ({ ...p }));
  }

  /**
   * Mock populate for creator details in list
   */
  populate(field, selectFields) {
    if (field === 'createdBy') {
      this.results = this.results.map((p) => {
        const creatorId = p.createdBy?._id || p.createdBy?.toString() || p.createdBy;
        const user = store.users.find((u) => u._id === creatorId);
        return {
          ...p,
          createdBy: user
            ? { _id: user._id, username: user.username, email: user.email }
            : null,
        };
      });
    }
    return this;
  }

  sort(sortObj) {
    if (!sortObj) return this;
    const field = Object.keys(sortObj)[0];
    const direction = sortObj[field]; // 1 (asc) or -1 (desc)

    this.results.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'createdAt') {
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
      }

      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * direction;
      }
      return (valA - valB) * direction;
    });

    return this;
  }

  skip(skipNum) {
    if (typeof skipNum === 'number') {
      this.results = this.results.slice(skipNum);
    }
    return this;
  }

  limit(limitNum) {
    if (typeof limitNum === 'number') {
      this.results = this.results.slice(0, limitNum);
    }
    return this;
  }

  /**
   * Thenable interface to allow direct awaiting
   */
  then(resolve, reject) {
    resolve(this.results);
  }
}

class Product {
  /**
   * Mock search query returning multiple results query chain
   */
  static find(queryObj) {
    const filtered = this.applyQueryFilters(queryObj);
    return new ProductQuery(filtered);
  }

  /**
   * Mock search single product
   */
  static findOne(queryObj) {
    if (!queryObj) return new SingleProductQuery(null);
    
    if (queryObj.sku) {
      const skuVal = queryObj.sku.toUpperCase();
      const prod = store.products.find((p) => p.sku === skuVal);
      return new SingleProductQuery(prod || null);
    }
    
    return new SingleProductQuery(null);
  }

  /**
   * Mock search by ID
   */
  static findById(id) {
    if (!id) return new SingleProductQuery(null);
    const prod = store.products.find((p) => p._id === id.toString());
    return new SingleProductQuery(prod || null);
  }

  /**
   * Mock document count matching query
   */
  static async countDocuments(queryObj) {
    const filtered = this.applyQueryFilters(queryObj);
    return filtered.length;
  }

  /**
   * Mock deletion
   */
  static async deleteOne(queryObj) {
    if (queryObj && queryObj._id) {
      const id = queryObj._id.toString();
      const idx = store.products.findIndex((p) => p._id === id);
      if (idx !== -1) {
        store.products.splice(idx, 1);
        return { deletedCount: 1 };
      }
    }
    return { deletedCount: 0 };
  }

  /**
   * Mock creation
   */
  static async create(data) {
    const skuVal = data.sku.toUpperCase();
    
    // Safety check for unique SKU
    const exists = store.products.find((p) => p.sku === skuVal);
    if (exists) {
      const err = new Error(`Duplicate SKU entered: ${skuVal}`);
      err.code = 11000;
      err.keyValue = { sku: skuVal };
      throw err;
    }

    const newProd = {
      _id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      sku: skuVal,
      description: data.description || '',
      price: parseFloat(data.price),
      category: data.category,
      stock: parseInt(data.stock, 10),
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.products.push(newProd);
    return this.wrap(newProd);
  }

  /**
   * Mock aggregate stats using JavaScript array calculations
   */
  static async aggregate(pipeline) {
    // 1. Overall stats calculations
    const totalProducts = store.products.length;
    const totalPrice = store.products.reduce((acc, p) => acc + p.price, 0);
    const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;
    const highestPrice = totalProducts > 0 ? Math.max(...store.products.map((p) => p.price)) : 0;
    const lowestPrice = totalProducts > 0 ? Math.min(...store.products.map((p) => p.price)) : 0;
    const totalInventoryValue = store.products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const totalStock = store.products.reduce((acc, p) => acc + p.stock, 0);

    // 2. Low stock count
    const lowStockCount = store.products.filter((p) => p.stock < 10).length;

    // 3. Category distribution groups
    const categoriesMap = {};
    store.products.forEach((p) => {
      if (!categoriesMap[p.category]) {
        categoriesMap[p.category] = {
          _id: p.category,
          count: 0,
          totalPrice: 0,
          totalStock: 0,
          inventoryValue: 0,
        };
      }
      const cat = categoriesMap[p.category];
      cat.count += 1;
      cat.totalPrice += p.price;
      cat.totalStock += p.stock;
      cat.inventoryValue += p.price * p.stock;
    });

    const categoryDistribution = Object.values(categoriesMap)
      .map((cat) => ({
        _id: cat._id,
        count: cat.count,
        avgPrice: cat.totalPrice / cat.count,
        totalStock: cat.totalStock,
        inventoryValue: cat.inventoryValue,
      }))
      .sort((a, b) => b.count - a.count);

    return [
      {
        overall: [
          {
            totalProducts,
            averagePrice,
            highestPrice,
            lowestPrice,
            totalInventoryValue,
            totalStock,
          },
        ],
        lowStock: [
          {
            count: lowStockCount,
          },
        ],
        categoryDistribution,
      },
    ];
  }

  /**
   * Utility to apply mongo-style queries to Javascript arrays
   */
  static applyQueryFilters(queryObj) {
    let filtered = [...store.products];
    if (!queryObj) return filtered;

    // Global Search Check
    if (queryObj.$or) {
      const firstSearch = queryObj.$or[0];
      const searchPattern = firstSearch.name.$regex;
      const regex = new RegExp(searchPattern, 'i');
      
      filtered = filtered.filter(
        (p) =>
          regex.test(p.name) ||
          regex.test(p.sku) ||
          (p.description && regex.test(p.description))
      );
    }

    // Category Filter
    if (queryObj.category) {
      filtered = filtered.filter((p) => p.category === queryObj.category);
    }

    // Price Filter Range ($gte and $lte)
    if (queryObj.price) {
      if (queryObj.price.$gte !== undefined) {
        filtered = filtered.filter((p) => p.price >= queryObj.price.$gte);
      }
      if (queryObj.price.$lte !== undefined) {
        filtered = filtered.filter((p) => p.price <= queryObj.price.$lte);
      }
    }

    // Stock Filter Options
    if (queryObj.stock !== undefined) {
      const stockVal = queryObj.stock;
      if (typeof stockVal === 'number') {
        filtered = filtered.filter((p) => p.stock === stockVal);
      } else {
        if (stockVal.$gt !== undefined) {
          filtered = filtered.filter((p) => p.stock > stockVal.$gt);
        }
        if (stockVal.$lt !== undefined) {
          filtered = filtered.filter((p) => p.stock < stockVal.$lt);
        }
      }
    }

    return filtered;
  }

  /**
   * Wrap raw product record with helper query methods
   */
  static wrap(prod) {
    return {
      ...prod,
      save: async function () {
        const idx = store.products.findIndex((p) => p._id === this._id);
        
        // SKU check for uniqueness when editing
        const duplicate = store.products.find((p) => p.sku === this.sku.toUpperCase() && p._id !== this._id);
        if (duplicate) {
          const err = new Error(`Duplicate SKU entered: ${this.sku}`);
          err.code = 11000;
          err.keyValue = { sku: this.sku };
          throw err;
        }

        this.updatedAt = new Date();
        this.sku = this.sku.toUpperCase();
        
        if (idx !== -1) {
          store.products[idx] = {
            ...this,
            price: parseFloat(this.price),
            stock: parseInt(this.stock, 10),
          };
        }
        return this;
      },
    };
  }
}

module.exports = Product;
