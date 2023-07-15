import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import { Box, Divider } from '@mui/material';
import cn from 'classnames';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import MButton from 'src/app/components/Button';
import { SignifyLogo } from 'src/app/components/Logo';
import { $Tooltip } from 'src/app/components/Tooltip';
import { dashboardPaths } from 'src/app/routes';
import './styles.scss';

export const Sidebar = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  console.log('toggle', toggle);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        width: toggle ? '6rem' : '22rem',
        transition: 'width 0.4s ease 0s',
        borderColor: 'var(--gray2)',
        backgroundColor: 'var(--white)',
        borderStyle: 'solid',
        boxShadow: 'rgba(0, 0, 0, 0.06) 0px -9px 9px',
      }}
    >
      {/* -------------------------------------- Esign Logo ------------------------------- */}
      <Box
        sx={{
          borderBottom: '1px solid var(--border-gray)',
          height: '7.75rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2.2rem',
        }}
      >
        <SignifyLogo
          sx={{
            paddingLeft: toggle ? '0.2rem' : '2.3rem',
            transition: 'padding-left 0.4s ease-in-out',
            zIndex: 100,
            gap: '1.5rem',
          }}
          text="[III]"
          variant="h2"
          direction="row"
          color="var(--dark3)"
          width="50px"
          height="auto"
        />
      </Box>

      {/* -------------------------------------- Mapping Sidebar ------------------------------- */}

      <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex', gap: '0.7rem' }}>
        {dashboardPaths.map((path, index) => {
          const Icon = path.icon;
          return (
            <>
              {path.to === '/logs' && (
                <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                  <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
                </Box>
              )}
              <$Tooltip key={index} title={path.name} disableHoverListener={!toggle} placement="right">
                <div>
                  <NavLink
                    className={({ isActive }) => {
                      const activeStyle = isActive ? 'nav_active' : 'nav_normal';
                      return cn(activeStyle, 'nav_item');
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      // if (haveUnsavedWork) {
                      //   const a = confirm('Are you sure you want to leave?');
                      //   if (a) {
                      //     navigate(path.to);
                      //   }
                      // }
                      navigate(path.to);
                    }}
                    to={path.to}
                    key={index}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.0rem', transition: 'background 0.3s ease 0s' }}>
                      <Icon sx={{ fontSize: '2.5rem' }} />
                      {!toggle && (
                        <span
                          style={{
                            opacity: toggle ? 0 : 1,
                            width: toggle ? '0px' : 'auto',
                            color: 'inherit',
                            overflow: 'hidden',
                            fontSize: '1.6rem',
                            animation: '0.8s ease 0s 1 normal forwards running krSvVP',
                          }}
                        >
                          {path.name}
                        </span>
                      )}
                    </Box>
                  </NavLink>
                </div>
              </$Tooltip>
            </>
          );
        })}
      </Box>

      {/* ------------------------------- Support ------------------------------------- */}
      <Box sx={{ paddingBottom: '5rem' }}>
        <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
        </Box>
        <$Tooltip title={'Support'} disableHoverListener={!toggle} placement="right">
          <NavLink className="nav_item nav_normal" to="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.9rem', transition: 'background 0.3s ease 0s' }}>
              <HelpOutlineOutlinedIcon sx={{ fontSize: '2.5rem' }} />
              {!toggle && (
                <span
                  style={{
                    opacity: toggle ? 0 : 1,
                    width: toggle ? '0px' : 'auto',
                    color: 'inherit',
                    overflow: 'hidden',
                    fontSize: '1.6rem',
                    animation: '0.8s ease 0s 1 normal forwards running krSvVP',
                  }}
                >
                  Support
                </span>
              )}
            </Box>
          </NavLink>
        </$Tooltip>
        <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
        </Box>
        <MButton
          disableRipple
          sx={{
            position: 'absolute',
            borderRadius: '99rem',
            backgroundColor: 'transparent',
            bottom: '2rem',
            left: '1.8rem',
            transition: 'left 0.4s ease-in-out',
            padding: '0',
            zIndex: 1001,
            ':hover': { opacity: 0.8 },
          }}
          onClick={() => setToggle(!toggle)}
        >
          <KeyboardCapslockIcon
            sx={{
              transform: toggle ? 'rotate(90deg)' : 'rotate(-90deg)',
              transition: 'transform 0.3s ease-in-out',
              fontSize: '2.8rem',
              padding: '0.1rem',
              borderRadius: '99rem',
              color: 'var(--ligh-blue1)',
              ':hover': { color: 'var(--ligh-blue3)' },
            }}
          />
        </MButton>
      </Box>
    </Box>
  );
};
