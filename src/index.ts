import getData from "./getData";
import { DataTypes, ModelDefined, Optional, Sequelize } from "sequelize";

// to see the relevant doc pages we crawl, check indexedFiles.js

const sequelize = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: __dirname + '/../Jest.docset/Contents/Resources/docSet.dsidx',
});

interface SearchIndexAttributes {
  id: number;
  name: string;
  type: string;
  path: string;
}
interface SearchIndexCreationAttributes extends Optional<SearchIndexAttributes, "id"> {};

const searchIndex: ModelDefined<SearchIndexAttributes, SearchIndexCreationAttributes> = sequelize.define(
  'searchIndex',
  {
    name: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    path: {type: DataTypes.STRING},
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

searchIndex.sync().then(function() {
  var data = getData();
  data.forEach((header) => {
    const record: SearchIndexCreationAttributes = {
      name: header.name,
      type: header.type,
      path: header.path
    };

    searchIndex.bulkCreate([ record ], { ignoreDuplicates: true });
  });
});
