import {Model, DataTypes} from "sequelize";
import { sequelize } from "../config/db.js";
import { LIST_TAGS } from "../utils/constants.js";

class Post extends Model {}

Post.init(
  {    
    id: {
      type: DataTypes.INTEGER(),
      autoIncrement: true,      
      primaryKey: true
    },
    idUser: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      references: {
        model:"users",
        key: "id"
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    selectedTags: {
      type: DataTypes.ARRAY(DataTypes.STRING(50)),
      defaultValue: [],
      validate: {
        validationTags(value){
          if(!Array.isArray(value)) throw new Error("Los tags debe ser un Array");
          value.forEach(tag => {
            if(!LIST_TAGS.includes(tag)) throw new Error(`El Tag ${tag} no es válido`);            
          });          
        }
      }
    },
    openComments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['idUser', 'title'],
        name: 'unique_title'
      }
    ]
  }
);

export default Post;