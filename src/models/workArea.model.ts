import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import User from "./users.model";

export interface WorkAreaAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class WorkArea
  extends Model<WorkAreaAttributes>
  implements WorkAreaAttributes
{
  public id!: number;
  public name!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WorkArea.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "work_areas",
    timestamps: true,
  }
);

WorkArea.hasMany(User, {
  foreignKey: "workAreaId",
  as: "users",
});
User.belongsTo(WorkArea, {
  foreignKey: "workAreaId",
  as: "workArea",
});
