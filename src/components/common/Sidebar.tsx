import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  Tooltip,
  IconButton,
  Divider,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InsightsIcon from '@mui/icons-material/Insights';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useFinance } from '../../context/FinanceContext';

const DRAWER_WIDTH = 250;
const MINI_DRAWER_WIDTH = 68;

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { debtors, bankLines } = useFinance();

  const pendingReconciliations = bankLines.filter((line) => !line.reconciled).length;
  const criticalDebtorsCount = debtors.filter((d) => d.riskLevel === 'Critical' || d.riskLevel === 'High').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Cash Flow Overview',
      icon: <DashboardIcon />,
      badge: null,
    },
    {
      id: 'debtors',
      label: 'Debtors Ledger',
      icon: <PeopleAltIcon />,
      badge: criticalDebtorsCount > 0 ? criticalDebtorsCount : null,
      badgeColor: 'error' as const,
    },
    {
      id: 'reconciliation',
      label: 'Bank Reconciliation',
      icon: <CompareArrowsIcon />,
      badge: pendingReconciliations > 0 ? pendingReconciliations : null,
      badgeColor: 'primary' as const,
    },
    {
      id: 'analytics',
      label: 'Financial Analytics',
      icon: <InsightsIcon />,
      badge: null,
    },
    {
      id: 'executive',
      label: 'CFO Briefing (AI)',
      icon: <AssessmentIcon />,
      badge: 'AI',
      badgeColor: 'error' as const,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: collapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: 'hidden',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          top: 0,
          height: '100vh',
          zIndex: (theme) => theme.zIndex.drawer,
        },
      }}
    >
      {/* Sidebar Top Header with Hemraj Finance Branding */}
      <Box
        sx={{
          p: collapsed ? 1.5 : 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', overflow: 'hidden' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 20 }} />
          </Box>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  HEMRAJ FINANCE
                </Typography>
                <Chip
                  label="INR"
                  size="small"
                  sx={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.625rem',
                    height: 18,
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                  }}
                />
              </Stack>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem', display: 'block', mt: 0.1 }}>
                Receivables Platform
              </Typography>
            </Box>
          )}
        </Stack>

        {!collapsed && (
          <IconButton size="small" onClick={onToggleCollapse} sx={{ border: '1px solid #e5e7eb', ml: 1 }}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {collapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <IconButton size="small" onClick={onToggleCollapse} sx={{ border: '1px solid #e5e7eb' }}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ p: 1.5, pb: 0.5 }}>
        {!collapsed && (
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.08em', ml: 1, fontSize: '0.675rem' }}>
            MODULES
          </Typography>
        )}
      </Box>

      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={collapsed ? item.label : ''} placement="right">
                <ListItemButton
                  selected={isActive}
                  onClick={() => onSelectTab(item.id)}
                  sx={{
                    minHeight: 42,
                    justifyContent: collapsed ? 'center' : 'initial',
                    px: collapsed ? 1.5 : 1.75,
                    borderRadius: '6px',
                    backgroundColor: isActive ? '#f1f5f9' : 'transparent',
                    color: isActive ? '#0f172a' : '#475569',
                    '&.Mui-selected': {
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#e2e8f0',
                      },
                    },
                    '&:hover': {
                      backgroundColor: isActive ? '#e2e8f0' : '#f8fafc',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 1.75,
                      justifyContent: 'center',
                      color: isActive ? '#0f172a' : '#64748b',
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color={item.badgeColor || 'primary'}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

