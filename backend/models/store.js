const bcrypt = require('bcryptjs');

// In-memory data store for Demo Mode
const store = {
  users: [
    {
      _id: "operator-001",
      username: "test_operator",
      email: "operator@syntecxhub.com",
      password: bcrypt.hashSync("securePassword123", 10),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  products: [
    {
      _id: "prod-001",
      name: "Wireless Mechanical Keyboard",
      sku: "KB-WRLS-87",
      description: "Tenkeyless layout mechanical keyboard with customized brown tactile switches and soft white backlights.",
      price: 79.99,
      category: "Electronics",
      stock: 25,
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-002",
      name: "Ergonomic Gaming Mouse",
      sku: "MS-ERGO-02",
      description: "Wireless gaming mouse featuring an optical sensor up to 16,000 DPI and dual-mode connection.",
      price: 49.99,
      category: "Electronics",
      stock: 3, // Low stock product
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-003",
      name: "AMD Ryzen 9 7900X CPU",
      sku: "CPU-RYZ9-79",
      description: "Desktop processor with 12 cores, 24 threads, up to 5.6GHz boost, and PCIe 5.0 graphics support.",
      price: 399.99,
      category: "Electronics",
      stock: 12,
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-004",
      name: "Standing Desk Frame",
      sku: "DSK-STND-BL",
      description: "Electric dual-motor height adjustable standing desk frame with 3-stage lifting columns (Black).",
      price: 249.99,
      category: "Furniture",
      stock: 8, // Low stock product
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-005",
      name: "Ergonomic Mesh Office Chair",
      sku: "CHR-MESH-ER",
      description: "High-back office chair with adjustable lumbar support, 3D armrests, and dynamic tilting mechanism.",
      price: 189.99,
      category: "Furniture",
      stock: 15,
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-006",
      name: "Double-Sided Leather Desk Pad",
      sku: "PAD-LTHR-GY",
      description: "Waterproof desk blotter pad protector made of microfibre PU leather, 80cm x 40cm (Gray/Blue).",
      price: 15.99,
      category: "Office Supplies",
      stock: 45,
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "prod-007",
      name: "Heavy Duty Staples (5,000 count)",
      sku: "STP-HD-5000",
      description: "Standard size staples for premium staplers. High-quality carbon steel wire minimizes jams.",
      price: 4.49,
      category: "Office Supplies",
      stock: 0, // Out of stock
      createdBy: "operator-001",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    }
  ]
};

module.exports = store;
