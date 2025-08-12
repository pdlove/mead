module.exports = (sequelize, DataTypes) => {
    // Product Model
    const Product = sequelize.define('Product', {
        productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
        name: { type: DataTypes.STRING, allowNull: false },
        size: { type: DataTypes.STRING, allowNull: false },
        modifier: { type: DataTypes.STRING, allowNull: true },
        categoryID: { type: DataTypes.INTEGER, allowNull: false }, 
        BasePrice: { type: DataTypes.FLOAT, allowNull: false },
        LastCost: { type: DataTypes.FLOAT, allowNull: false },
        QtyBlank: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        QtyMade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        QtyScrap: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        QtySoldRecently: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    });

    return Product;
}