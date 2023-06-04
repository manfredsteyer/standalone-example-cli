import { noDependencies, sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  version: 1,
  tagging: {
    'src/app': {
      'shared': {
        'feature-<feature>': ['shared', 'type:feature'],
        'ui-<ui>': ['shared', 'type:ui'],
        'data': ['shared', 'type:data'],
        'util-<ui>': ['shared', 'type:util'],
      },
      'domains/<domain>': {
        'feature-<feature>': ['domain:<domain>', 'type:feature'],
        'ui-<ui>': ['domain:<domain>', 'type:ui'],
        'data': ['domain:<domain>', 'type:data'],
        'util-<ui>': ['domain:<domain>', 'type:util'],
      },
      'ngrx-signal-store-poc': ['type:util', 'shared']
    },
  },
  depRules: {
    'root': ['*'],
    'ngrx-signal-store-poc': ['*'],
    'domain:*': [sameTag, 'shared'],
    'shared': ['shared'],
    'type:feature': ['type:ui', 'type:data', 'type:util'],
    'type:ui': ['type:data', 'type:util'],
    'type:data': ['type:util'],
    'type:util': noDependencies
  },
};
