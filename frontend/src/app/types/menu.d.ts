export type MenuItemId = 
    '/' | 
    'clients' | 
    'settings' | 
    'appearance' | 
    'reports' |
    'visibility' | 
    null;

export interface MenuContextType {
  selected: MenuItemId;
  setSelected: (id: MenuItemId) => void;
}
