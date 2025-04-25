import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export interface ExternalSystemAttributes {
  id?: number;
  name: string;
  key: string;
  url: string;
}

export default class ExternalSystem
  extends Model<ExternalSystemAttributes>
  implements ExternalSystemAttributes
{
  public id!: number;
  public name!: string;
  public key!: string;
  public url!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExternalSystem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "external_systems",
  }
);
