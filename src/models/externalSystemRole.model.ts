import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import ExternalSystem from "./externalSystems.model";

export interface ExternalSystemRoleAttributes {
  id?: number;
  name: string;
  externalSystemId: number;
}

export default class ExternalSystemRole
  extends Model<ExternalSystemRoleAttributes>
  implements ExternalSystemRoleAttributes
{
  public id!: number;
  public name!: string;
  public externalSystemId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExternalSystemRole.init(
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
    externalSystemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ExternalSystem,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "external_system_roles",
  }
);
