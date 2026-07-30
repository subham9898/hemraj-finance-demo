import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, width: '100%' }}>
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: '#fff',
              borderColor: '#fee2e2',
            }}
          >
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {this.props.fallbackTitle || 'Component Error Encountered'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </Typography>
            </Alert>

            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              size="small"
              sx={{ mt: 1 }}
            >
              Reload Section
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
