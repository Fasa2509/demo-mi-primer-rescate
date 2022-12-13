import { FC, useContext, useState } from 'react';
import NextLink from 'next/link';
import { Box, Link, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { MenuContext } from '../../context';
import styles from './SideMenu.module.css';

interface link {
  path: string;
  text: string;
}

interface Props {
  children: JSX.Element;
  text: string;
  links: link[];
  active: boolean;
}

export const SideMenuButton: FC<Props> = ({ children, text, links, active }) => {

  const [display, setDisplay] = useState( false );
  const { toggleSideMenu } = useContext( MenuContext );

  return (
    <Box>
      <ListItemButton sx={{ backgroundColor: active ? '#eee' : '#fff' }} onClick={ () => setDisplay( !display ) }>
          <ListItemIcon>
              { children }
          </ListItemIcon>
          <ListItemText primary={ text } />
      </ListItemButton>
      <Box className={ styles.links__display } display='flex' flexDirection='column' justifyContent='center' sx={{ height: display ? `${ 2.8 * links.length }rem` : 0 }}>
        {
          links.map(( link, index ) =>
            <NextLink key={ link.path + index } href={ link.path } passHref>
                <Link sx={{ height: '2.8rem', color: '#333', display: 'flex', alignItems: 'center', pl: 3 }} onClick={ toggleSideMenu }>
                  { link.text }
                </Link>
            </NextLink>
          )
        }
      </Box>
    </Box>
  )
}
