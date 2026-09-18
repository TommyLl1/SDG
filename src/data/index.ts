import dataset from '../data/esg-dataset.json';
import sourceCatalogJson from '../data/source-catalog.json';
import type { EsgDataset, SourceCatalog } from '../lib/types';

export const esgDataset = dataset as EsgDataset;
export const sourceCatalog = sourceCatalogJson as SourceCatalog;

