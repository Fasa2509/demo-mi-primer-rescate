import { FC, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Link, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import styles from './SideMenu.module.css';

interface link {
  path: string;
  text: string;
}

interface Props {
  children: JSX.Element;
  text: string;
  links: link[];
}

export const SideMenuButton: FC<Props> = ({ children, text, links }) => {

  const [display, setDisplay] = useState( false );

  return (
    <Box>
      <ListItem button onClick={ () => setDisplay( !display ) }>
          <ListItemIcon>
              { children }
          </ListItemIcon>
          <ListItemText primary={ text } />
      </ListItem>
      <Box className={ styles.links__display } display='flex' flexDirection='column' justifyContent='center' sx={{ height: display ? `${ 2.8 * links.length }rem` : 0 }}>
        {
          links.map(( link, index ) =>
            <NextLink key={ link.path + index } href={ link.path } passHref>
                <Link sx={{ height: '2.8rem', color: '#333', display: 'flex', alignItems: 'center', pl: 3 }}>
                  { link.text }
                </Link>
            </NextLink>
          )
        }
      </Box>
    </Box>
  )
}
