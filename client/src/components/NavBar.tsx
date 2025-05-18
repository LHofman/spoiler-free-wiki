import { Button, Menu, NavLink } from '@mantine/core';
import { useAppSelector } from '../store/hooks';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactNode } from '@tanstack/react-router';

type MenuItemPage = { type: 'page'; name: string; pageId: string };
type MenuItemSubMenu = { type: 'subMenu'; name: string; items: MenuItem[] };
type MenuItem = MenuItemPage | MenuItemSubMenu;
interface MenuType {
  name: string;
  items: {
    name: string;
    items: MenuItem[];
  }[];
}
function NavBar() {
  const progress = useAppSelector((state) => state.progress);
  const [menu, setMenu] = useState<MenuType|null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<MenuType>(`http://localhost:3000/api/menus/navbar/${progress.season}/${progress.episode}`);
        console.log("Fetched menu:", response.data);
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchPage();
  }, [progress]);

  const renderMenuItem = (item: MenuItem, index: number): ReactNode => {
    if (item.type === 'page') {
      return (
        <Menu.Item key={index}>
          <NavLink href={`/pages/${item.pageId}`} label={item.name} />
        </Menu.Item>
      );
    }

    return (
      <Menu.Sub>
        <Menu.Sub.Target>
          <Menu.Sub.Item>{item.name}</Menu.Sub.Item>
        </Menu.Sub.Target>

        <Menu.Sub.Dropdown>
          { item.items.map(renderMenuItem) }
        </Menu.Sub.Dropdown>
      </Menu.Sub>
    );
  }

  return (
    <div style={{ marginBottom: '3em' }}>
      { menu?.items.map((item, index) => (
        <Menu trigger='hover' key={index}>
          <Menu.Target>
            <Button variant='subtle'>{item.name}</Button>
          </Menu.Target>

          <Menu.Dropdown>
            { item.items.map(renderMenuItem) }
          </Menu.Dropdown>
        </Menu>
      )) }
    </div>
  );
}

export default NavBar;