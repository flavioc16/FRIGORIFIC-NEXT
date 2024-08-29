export type MenuItemId = 
    '/' | 
    'clients' | 
    'products' | 
    'reminders' | 
    'reports' |
    'moneybox' | 
    null;

export interface MenuContextType {
  selected: MenuItemId;
  setSelected: (id: MenuItemId) => void;
}
