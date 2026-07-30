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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InsightsIcon from '@mui/icons-material/Insights';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useFinance } from '../../context/FinanceContext';

const DRAWER_WIDTH = 240;
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
          top: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', p: 1.5 }}>
        {!collapsed && (
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.08em', ml: 1 }}>
            MODULES
          </Typography>
        )}
        <IconButton size="small" onClick={onToggleCollapse} sx={{ border: '1px solid #e5e7eb' }}>
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 1, borderColor: '#f3f4f6' }} />

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
