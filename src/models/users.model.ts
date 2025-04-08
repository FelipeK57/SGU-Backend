import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export interface UserAttributes {
  id?: number;
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  role: string;
  email: string;
  password: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public lastName!: string;
  public documentType!: string;
  public documentNumber!: string;
  public role!: "admin" | "employee";
  public email!: string;
  public password!: string;
  public active!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
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
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "employee"),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);
