/** PK = primary key, UQ = unique, FK = foreign key in the same schema, ref = an ID from another schema, no foreign key. */
export type SchemaColumnTag = 'PK' | 'UQ' | 'FK' | 'ref';

export interface SchemaColumn {
  name: string;
  type: string;
  tag?: SchemaColumnTag;
}

export interface SchemaTable {
  name: string;
  x: number;
  y: number;
  width: number;
  columns: SchemaColumn[];
  /** Small gray line under the table, such as an index or the shard key. */
  note?: string;
}

/** A schema owned by one module, drawn as a dashed box around its tables. */
export interface SchemaGroup {
  label: string;
  caption: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SchemaSide = 'left' | 'right';

export interface SchemaColumnRef {
  table: string;
  column: string;
  side: SchemaSide;
}

/** A line from a column to the column it points at. */
export interface SchemaRelation {
  from: SchemaColumnRef;
  to: SchemaColumnRef;
  /** Crosses schemas: only the ID is stored, with no foreign key and no JOIN. */
  crossSchema?: boolean;
  label?: { x: number; y: number; text: string };
}
