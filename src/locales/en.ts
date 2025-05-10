/**
 * English translation
 */
const en = {
  // i18n configuration
  i18n: {
    locale: 'en-US'
  },
  
  // Common
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    upload: 'Upload',
    import: 'Import',
    reset: 'Reset',
    back: 'Back',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    required: 'Required',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
    update: 'Update',
    delete: 'Delete',
  },
  
  // Navigation
  nav: {
    title: 'Script Market Upload',
    language: 'Language',
  },
  
  // Form fields
  form: {
    id: {
      label: 'Script ID',
      placeholder: 'Enter an ID that follows folder naming conventions',
      help: 'ID will be used as the unique identifier in the repository, can only contain letters, numbers, underscores and hyphens',
      error: 'Invalid ID format',
    },
    password: {
      label: 'Update & Delete Password',
      placeholder: 'Enter password',
      help: 'Used for future updates and deletions, please keep it safe',
      error: 'Password cannot be empty',
      incorrect: 'Password is incorrect',
      verify: 'Please enter password to verify',
    },
    name: {
      label: 'Script Name',
      placeholder: 'Enter script name',
      error: 'Name cannot be empty',
    },
    author: {
      label: 'Author',
      placeholder: 'Enter author name',
      error: 'Author cannot be empty',
    },
    version: {
      label: 'Version',
      placeholder: 'Auto-generated, optional to modify',
      help: 'Default is auto-generated based on timestamp',
    },
    tags: {
      label: 'Tags',
      placeholder: 'Select tags',
      help: 'Multiple selection allowed',
    },
    content: {
      label: 'Script Content',
      placeholder: 'Enter script code',
      error: 'Script content cannot be empty',
    },
    info: {
      label: 'Author Notes',
      placeholder: 'Enter notes (optional)',
    },
    buttons: {
      label: 'Button Triggers',
      add: 'Add Button',
      remove: 'Remove',
      id: 'Button ID',
      name: 'Button Name',
      description: 'Button Description',
      visible: 'Visible',
      invisible: 'Hidden',
    },
  },
  
  // Confirmation dialog
  confirm: {
    title: 'Confirm Upload',
    content: 'Please confirm the following information:',
    submit: 'Confirm Upload',
    cancel: 'Back to Edit',
  },
  
  // File exists dialog
  fileExists: {
    title: 'File Already Exists',
    content: 'A script with this ID already exists. Please choose an action:',
    passwordVerify: 'Please enter the original password to verify',
    updateQuestion: 'How would you like to handle the existing script?',
    updateScript: 'Update Script',
    deleteScript: 'Delete Script',
    cancel: 'Cancel Operation',
    incorrectPassword: 'Password is incorrect, cannot proceed',
  },
  
  // Result page
  result: {
    success: {
      title: 'Operation Successful',
      content: 'Your script has been successfully uploaded to the GitHub repository',
      update: 'Script successfully updated',
      delete: 'Script successfully deleted',
    },
    error: {
      title: 'Upload Failed',
      content: 'An error occurred during the upload process',
      retry: 'Retry',
      updateFailed: 'Update failed',
      deleteFailed: 'Delete failed',
    },
    script: {
      name: 'Script Name',
      url: 'File Link',
      view: 'View File',
    },
    credentials: {
      title: 'Script Credentials',
      description: 'Please keep the following credentials safe. The Script ID is the unique identifier in the repository. To update or delete the script in the future, you must use the same ID and password.',
      id: 'Script ID',
      password: 'Script Password',
      copy: 'Copy',
      copyAll: 'Copy All Credentials',
      idCopied: 'Script ID copied',
      passwordCopied: 'Script password copied',
      allCopied: 'All credentials copied'
    }
  },
  
  // Validation messages
  validation: {
    idFormat: 'ID can only contain letters, numbers, underscores and hyphens',
    nameFormat: 'Script name cannot contain the following characters: / \\ : * ? " < > |',
    required: 'This field is required',
    buttonNameRequired: 'Button name is required',
  },
  
  // Script Market Page
  scriptMarket: {
    title: 'Script Market',
    pageTitle: 'Script Directory',
    
    // Search and Filter
    search: {
      placeholder: 'Search script name'
    },
    filter: {
      tags: 'Select tags',
      author: 'Search author'
    },
    sort: {
      label: 'Sort',
      updatedAt: 'Recently updated',
      createdAt: 'Creation time',
      name: 'Name'
    },
    view: {
      card: 'Card view',
      table: 'Table view'
    },
    
    // Card view
    card: {
      viewDetails: 'View details',
      updated: 'Updated',
      version: 'Version'
    },
    
    // Table view
    table: {
      name: 'Name',
      author: 'Author',
      tags: 'Tags',
      version: 'Version',
      updatedAt: 'Update time',
      action: 'Action',
      viewDetails: 'View details',
      download: 'Download'
    },
    
    // Pagination
    pagination: {
      total: 'Total',
      items: 'items'
    },
    
    // Detail modal
    detail: {
      title: 'Script details',
      author: 'Author',
      version: 'Version',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      content: 'Script content',
      buttons: 'Button configuration',
      visible: 'Visible',
      invisible: 'Hidden',
      download: 'Download script',
      copy: 'Copy content',
      downloadSuccess: 'Download successful',
      downloadFailed: 'Download failed',
      copySuccess: 'Copy successful',
      copyFailed: 'Copy failed',
      noData: 'No script data found',
      history: 'Version history',
      viewVersionHistory: 'View script version history'
    },
    
    // Footer
    footer: {
      total: 'Total scripts',
      lastUpdated: 'Last updated',
      copyright: 'Script Market'
    },
    
    // Error messages
    error: {
      title: 'Loading error'
    },
    
    // Empty state
    empty: 'No matching scripts found',
    
    // Refresh button
    refresh: 'Refresh',
    
    // Relative time
    time: {
      justNow: 'Just now',
      minutesAgo: '{count} minutes ago',
      hoursAgo: '{count} hours ago',
      daysAgo: '{count} days ago',
      monthsAgo: '{count} months ago',
      yearsAgo: '{count} years ago'
    }
  },
  
  // Import functionality
  import: {
    button: 'Import',
    success: 'Import successful',
    error: 'Import failed, please check file format',
    invalidFileType: 'Please upload a valid JSON file'
  }
};

export default en;