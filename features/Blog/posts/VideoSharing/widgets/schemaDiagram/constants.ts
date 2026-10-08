import type { SchemaColumnTag, SchemaGroup, SchemaRelation, SchemaTable } from '@/features/Blog/posts/VideoSharing/widgets/schemaDiagram/types';

export const SCHEMA_DIAGRAM = {
  width: 860,
  height: 500,
  minWidthClass: 'min-w-[680px]',
  headerHeight: 24,
  rowHeight: 16,
  paddingBottom: 8,
  /** How far a relation line bends out of the table before it turns. */
  curveReach: 28,
  tableColor: '#fb7185',
  lineColor: '#a3a3a3',
  legendY: 490,
} as const;

export const SCHEMA_TAG_COLORS: Record<SchemaColumnTag, string> = {
  PK: '#ef4444',
  UQ: '#fbbf24',
  FK: '#38bdf8',
  ref: '#737373',
};

/** The whole cluster, then one box per module schema. */
export const SCHEMA_CLUSTER: SchemaGroup = {
  label: 'One MySQL server',
  caption: 'one schema per module',
  x: 8,
  y: 8,
  width: 844,
  height: 464,
};

export const SCHEMA_GROUPS: SchemaGroup[] = [
  { label: 'accounts', caption: 'accounts module', x: 24, y: 40, width: 240, height: 200 },
  { label: 'comments', caption: 'first to move out', x: 24, y: 256, width: 240, height: 200 },
  { label: 'videos', caption: 'watch page + upload service', x: 284, y: 40, width: 552, height: 416 },
];

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    x: 40,
    y: 72,
    width: 208,
    columns: [
      { name: 'id', type: 'bigint', tag: 'PK' },
      { name: 'email', type: 'text', tag: 'UQ' },
      { name: 'password_hash', type: 'text' },
      { name: 'display_name', type: 'text' },
      { name: 'avatar_url', type: 'text' },
      { name: 'status', type: 'active | banned' },
      { name: 'created_at', type: 'datetime' },
    ],
    note: 'refresh tokens + rate limits: Redis',
  },
  {
    name: 'comments',
    x: 40,
    y: 288,
    width: 208,
    columns: [
      { name: 'id', type: 'bigint', tag: 'PK' },
      { name: 'video_id', type: 'bigint', tag: 'ref' },
      { name: 'author_id', type: 'bigint', tag: 'ref' },
      { name: 'body', type: 'text' },
      { name: 'created_at', type: 'datetime' },
    ],
    note: 'index (video_id, created_at)',
  },
  {
    name: 'videos',
    x: 300,
    y: 72,
    width: 250,
    columns: [
      { name: 'id', type: 'bigint', tag: 'PK' },
      { name: 'owner_id', type: 'bigint', tag: 'ref' },
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'status', type: 'uploading | ... | ready' },
      { name: 'manifest_path', type: 'text' },
      { name: 'thumbnail_url', type: 'text' },
      { name: 'tasks_total', type: 'int' },
      { name: 'tasks_done', type: 'int' },
      { name: 'view_count', type: 'bigint' },
      { name: 'like_count', type: 'bigint' },
      { name: 'created_at', type: 'datetime' },
    ],
    note: 'later: sharded by hash(id)',
  },
  {
    name: 'uploads',
    x: 572,
    y: 72,
    width: 248,
    columns: [
      { name: 'id', type: 'bigint', tag: 'PK' },
      { name: 'idempotency_key', type: 'binary(16)', tag: 'UQ' },
      { name: 'video_id', type: 'bigint', tag: 'FK' },
      { name: 'owner_id', type: 'bigint', tag: 'ref' },
      { name: 'size_bytes', type: 'bigint' },
      { name: 'chunks_total', type: 'int' },
      { name: 'last_activity', type: 'datetime' },
      { name: 'expires_at', type: 'datetime' },
    ],
  },
  {
    name: 'transcode_tasks_done',
    x: 572,
    y: 256,
    width: 248,
    columns: [
      { name: 'video_id', type: 'bigint', tag: 'PK' },
      { name: 'task_id', type: 'int', tag: 'PK' },
      { name: 'finished_at', type: 'datetime' },
    ],
    note: 'a duplicate "done" hits the key',
  },
  {
    name: 'likes',
    x: 572,
    y: 362,
    width: 248,
    columns: [
      { name: 'video_id', type: 'bigint', tag: 'PK' },
      { name: 'user_id', type: 'bigint', tag: 'PK' },
      { name: 'created_at', type: 'datetime' },
    ],
    note: 'liking twice changes nothing',
  },
];

export const SCHEMA_RELATIONS: SchemaRelation[] = [
  {
    from: { table: 'uploads', column: 'video_id', side: 'left' },
    to: { table: 'videos', column: 'id', side: 'right' },
  },
  {
    from: { table: 'transcode_tasks_done', column: 'video_id', side: 'left' },
    to: { table: 'videos', column: 'id', side: 'right' },
  },
  {
    from: { table: 'likes', column: 'video_id', side: 'left' },
    to: { table: 'videos', column: 'id', side: 'right' },
  },
  {
    from: { table: 'videos', column: 'owner_id', side: 'left' },
    to: { table: 'users', column: 'id', side: 'right' },
    crossSchema: true,
    label: { x: 252, y: 96, text: 'id only' },
  },
  {
    from: { table: 'comments', column: 'video_id', side: 'right' },
    to: { table: 'videos', column: 'id', side: 'left' },
    crossSchema: true,
    label: { x: 252, y: 280, text: 'id only' },
  },
  {
    from: { table: 'comments', column: 'author_id', side: 'left' },
    to: { table: 'users', column: 'id', side: 'left' },
    crossSchema: true,
  },
];

export const SCHEMA_LEGEND: { tag: SchemaColumnTag; text: string }[] = [
  { tag: 'PK', text: 'primary key' },
  { tag: 'UQ', text: 'unique' },
  { tag: 'FK', text: 'foreign key, same schema' },
  { tag: 'ref', text: 'ID from another schema: no foreign key, no JOIN' },
];
