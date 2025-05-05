import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./users.model";
import ExternalSystem from "./externalSystems.model";
import ExternalSystemRole from "./externalSystemRole.model";

export interface ExternalSystemUserAttributes {
  id?: number;
  userId: number;
  externalSystemId: number;
  externalRoleId: number | null;
}

export default class ExternalSystemUser
  extends Model<ExternalSystemUserAttributes>
  implements ExternalSystemUserAttributes
{
  public id!: number;
  public userId!: number;
  public externalSystemId!: number;
  public externalRoleId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExternalSystemUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    externalSystemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    externalRoleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ExternalSystemRole,
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "external_system_users",
  }
);

// Relaciones
User.hasMany(ExternalSystemUser, { foreignKey: "userId" });
ExternalSystemUser.belongsTo(User, { foreignKey: "userId" });

ExternalSystem.hasMany(ExternalSystemUser, { foreignKey: "externalSystemId" });
ExternalSystemUser.belongsTo(ExternalSystem, {
  foreignKey: "externalSystemId",
});

ExternalSystemRole.hasMany(ExternalSystemUser, {
  foreignKey: "externalRoleId",
});
ExternalSystemUser.belongsTo(ExternalSystemRole, {
  foreignKey: "externalRoleId",
});
