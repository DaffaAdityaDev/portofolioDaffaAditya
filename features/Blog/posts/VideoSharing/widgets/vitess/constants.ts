export const VITESS_DIAGRAM = {
  width: 760,
  height: 350,
  minWidthClass: 'min-w-[600px]',
  boxFill: '#0d0d0d',
  boxStroke: '#525252',
  idleLine: '#525252',
  activeLine: '#ef4444',
} as const;

export const VITESS_API = { x: 290, y: 12, width: 180, height: 40 } as const;
export const VITESS_GATE = { x: 260, y: 96, width: 240, height: 46 } as const;
export const VITESS_TOPO = { x: 580, y: 96, width: 160, height: 46 } as const;

export const VITESS_SHARD_LAYOUT = { y: 196, width: 160, height: 130, firstX: 20, gap: 20 } as const;

/** Key ranges of the videos keyspace: hash(video_id) picks one. */
export const VITESS_SHARDS = ['-40', '40-80', '80-c0', 'c0-'] as const;

/** The shard the example query lands on. */
export const VITESS_ACTIVE_SHARD = '80-c0';
