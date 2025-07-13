import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export interface PasswordResetCodeAttributes {
  code: string;
  email: string;
  expirationDate: Date;
}

export default class PasswordResetCode
  extends Model<PasswordResetCodeAttributes>
  implements PasswordResetCodeAttributes
{
  public code!: string;
  public email!: string;
  public expirationDate!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordResetCode.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "password_reset_codes",
  }
);
