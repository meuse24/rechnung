import { createTheme } from '@mantine/core';

export const theme = createTheme({
  /** Primary color - used for focus states and primary buttons */
  primaryColor: 'blue',

  /** Color scheme */
  defaultRadius: 'sm',

  /** Improved focus ring visibility */
  focusRing: 'always',
  focusClassName: '',

  /** Dark mode colors */
  colors: {
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#424242',
      '#3b3b3b',
      '#2e2e2e',
      '#242424',
      '#1f1f1f',
      '#141414',
    ],
  },

  /** Component-specific overrides for better contrast */
  components: {
    Input: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',
          backgroundColor: 'var(--mantine-color-white)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },

          '&:disabled': {
            backgroundColor: 'var(--mantine-color-gray-1)',
            borderColor: 'var(--mantine-color-gray-3)',
            opacity: 0.7,
          },

          '&::placeholder': {
            color: 'var(--mantine-color-gray-6)',
            opacity: 1,
          },
        },

        label: {
          fontWeight: 600,
          color: 'var(--mantine-color-gray-9)',
          marginBottom: '6px',
        },

        error: {
          fontWeight: 500,
          color: 'var(--mantine-color-red-7)',
        },

        description: {
          color: 'var(--mantine-color-gray-7)',
          fontWeight: 500,
        },
      },
    },

    TextInput: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },
      },
    },

    NumberInput: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },
      },
    },

    Textarea: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },
      },
    },

    Select: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',
          backgroundColor: 'var(--mantine-color-white)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },

        dropdown: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },

        option: {
          fontWeight: 500,

          '&[data-hovered]': {
            backgroundColor: 'var(--mantine-color-blue-1)',
            color: 'var(--mantine-color-blue-9)',
          },

          '&[data-selected]': {
            backgroundColor: 'var(--mantine-color-blue-6)',
            color: 'var(--mantine-color-white)',
            fontWeight: 600,

            '&[data-hovered]': {
              backgroundColor: 'var(--mantine-color-blue-7)',
            },
          },
        },
      },
    },

    MultiSelect: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },

        dropdown: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },

        option: {
          '&[data-hovered]': {
            backgroundColor: 'var(--mantine-color-blue-1)',
          },

          '&[data-selected]': {
            backgroundColor: 'var(--mantine-color-blue-0)',
            color: 'var(--mantine-color-blue-9)',
            fontWeight: 600,
          },
        },
      },
    },

    Button: {
      styles: {
        root: {
          fontWeight: 600,
          borderWidth: '1.5px',

          '&:focus-visible': {
            outline: '2px solid var(--mantine-color-blue-6)',
            outlineOffset: '2px',
          },
        },
      },

      defaultProps: {
        variant: 'filled',
      },
    },

    Paper: {
      styles: {
        root: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-3)',
        },
      },
    },

    Card: {
      styles: {
        root: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-3)',
        },
      },
    },

    Table: {
      styles: {
        table: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-3)',
        },

        th: {
          fontWeight: 700,
          color: 'var(--mantine-color-gray-9)',
          backgroundColor: 'var(--mantine-color-gray-1)',
          borderBottomWidth: '2px',
          borderBottomColor: 'var(--mantine-color-gray-4)',
        },

        td: {
          borderBottomWidth: '1px',
          borderBottomColor: 'var(--mantine-color-gray-3)',
        },

        tr: {
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-0)',
          },
        },
      },
    },

    Modal: {
      styles: {
        content: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-3)',
        },

        header: {
          borderBottomWidth: '1.5px',
          borderBottomColor: 'var(--mantine-color-gray-3)',
          paddingBottom: '12px',
        },

        title: {
          fontWeight: 700,
          color: 'var(--mantine-color-gray-9)',
        },
      },
    },

    Checkbox: {
      styles: {
        input: {
          borderWidth: '2px',
          borderColor: 'var(--mantine-color-gray-5)',

          '&:checked': {
            borderColor: 'var(--mantine-color-blue-6)',
            backgroundColor: 'var(--mantine-color-blue-6)',
          },

          '&:focus': {
            outline: '2px solid var(--mantine-color-blue-3)',
            outlineOffset: '2px',
          },
        },

        label: {
          fontWeight: 500,
          color: 'var(--mantine-color-gray-9)',
        },
      },
    },

    Radio: {
      styles: {
        radio: {
          borderWidth: '2px',
          borderColor: 'var(--mantine-color-gray-5)',

          '&:checked': {
            borderColor: 'var(--mantine-color-blue-6)',
          },

          '&:focus': {
            outline: '2px solid var(--mantine-color-blue-3)',
            outlineOffset: '2px',
          },
        },

        label: {
          fontWeight: 500,
          color: 'var(--mantine-color-gray-9)',
        },
      },
    },

    Switch: {
      styles: {
        track: {
          borderWidth: '2px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&[data-checked]': {
            borderColor: 'var(--mantine-color-blue-6)',
            backgroundColor: 'var(--mantine-color-blue-6)',
          },
        },

        label: {
          fontWeight: 500,
          color: 'var(--mantine-color-gray-9)',
        },
      },
    },

    Badge: {
      styles: {
        root: {
          fontWeight: 600,
          borderWidth: '1px',
        },
      },
    },

    Alert: {
      styles: {
        root: {
          borderWidth: '1.5px',
        },

        title: {
          fontWeight: 700,
        },

        message: {
          fontWeight: 500,
        },
      },
    },

    Notification: {
      styles: {
        root: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },

        title: {
          fontWeight: 700,
        },

        description: {
          fontWeight: 500,
        },
      },
    },

    FileInput: {
      styles: {
        input: {
          borderWidth: '1.5px',
          borderColor: 'var(--mantine-color-gray-4)',

          '&:focus': {
            borderColor: 'var(--mantine-color-blue-6)',
            borderWidth: '2px',
          },
        },
      },
    },
  },

  /** Global styles for better contrast */
  other: {
    // Custom properties that can be used throughout the app
    focusRingColor: 'var(--mantine-color-blue-6)',
    borderColor: 'var(--mantine-color-gray-4)',
    borderWidth: '1.5px',
  },
});
