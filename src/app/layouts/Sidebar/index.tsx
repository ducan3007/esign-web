import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock'
import { Box, Divider } from '@mui/material'
import cn from 'classnames'
import { Fragment, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import MButton from 'src/app/components/Button'
import { SignifyLogo } from 'src/app/components/Logo'
import { MTooltip } from 'src/app/components/Tooltip'
import { dashboardPaths } from 'src/app/routes'
import './styles.scss'
import { useDispatch, useSelector } from 'react-redux'
import { actions, selectors } from '@esign-web/redux/auth'

export const Sidebar = () => {
  const dispatch = useDispatch()
  const isSidebarOpen = useSelector(selectors.getSidebarState)

  const navigate = useNavigate()

  console.log('isSidebarOpen', isSidebarOpen)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        width: isSidebarOpen ? '6rem' : '22rem',
        transition: 'width 0.4s ease 0s',
        borderColor: 'var(--gray2)',
        backgroundColor: 'var(--white)',
        borderStyle: 'solid',
        boxShadow: 'rgba(0, 0, 0, 0.06) 0px -9px 9px',
        borderRight: '1px solid var(--border-gray)',
      }}
    >
      {/* -------------------------------------- Esign Logo ------------------------------- */}
      <Box
        sx={{
          borderBottom: '1px solid var(--border-gray)',
          borderRight: '1px solid var(--border-gray)',
          height: '8.75rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2.2rem',
        }}
      >
        <SignifyLogo
          sx={{
            paddingLeft: isSidebarOpen ? '0.2rem' : '2.3rem',
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
          const Icon = path.icon
          return (
            <Fragment key={path.to}>
              {path.to === '/logs' && (
                <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                  <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
                </Box>
              )}
              <MTooltip title={path.name} disableHoverListener={!isSidebarOpen} placement="right">
                <div>
                  <NavLink
                    className={({ isActive }) => {
                      const activeStyle = isActive ? 'nav_active' : 'nav_normal'
                      return cn(activeStyle, 'nav_item')
                    }}
                    onClick={(event) => {
                      event.preventDefault()
                      /* TODO: check if there is any unsaved work */
                      if (false) {
                        const a = confirm('Are you sure you want to leave?')
                        if (a) {
                          navigate(path.to)
                        }
                      } else {
                        navigate(path.to)
                      }
                    }}
                    to={path.to}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.0rem', transition: 'background 0.3s ease 0s' }}>
                      <Icon sx={{ fontSize: '2.5rem' }} />
                      {!isSidebarOpen && (
                        <span
                          style={{
                            opacity: isSidebarOpen ? 0 : 1,
                            width: isSidebarOpen ? '0px' : 'auto',
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
              </MTooltip>
            </Fragment>
          )
        })}
      </Box>

      {/* ------------------------------- Support ------------------------------------- */}
      <Box sx={{ paddingBottom: '5rem' }}>
        <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
        </Box>
        <MTooltip title={'Support'} disableHoverListener={!isSidebarOpen} placement="right">
          <NavLink className="nav_item nav_normal" to="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.9rem', transition: 'background 0.3s ease 0s' }}>
              <HelpOutlineOutlinedIcon sx={{ fontSize: '2.5rem' }} />
              {!isSidebarOpen && (
                <span
                  style={{
                    opacity: isSidebarOpen ? 0 : 1,
                    width: isSidebarOpen ? '0px' : 'auto',
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
        </MTooltip>
        <Box sx={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <Divider sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
        </Box>

        {/* --------------------------- Toggle Button ---------------------------- */}
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
          onClick={() => dispatch(actions.toggleSidebar())}
        >
          <KeyboardCapslockIcon
            sx={{
              transform: isSidebarOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
              transition: 'transform 0.3s ease-in-out',
              fontSize: '2.8rem',
              padding: '0.1rem',
              borderRadius: '99rem',
              color: 'var(--orange)',
              fontWeight: 'bold',
            }}
          />
        </MButton>
      </Box>
    </Box>
  )
}
