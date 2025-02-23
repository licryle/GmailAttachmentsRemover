class ConfigStore {
  constructor() {
    if (ConfigStore.instance) {
      return ConfigStore.instance;
    }

    this.CONFIGS = {
      'DRYRUN_MODE': Constants.DRYRUN_MODE.DRYRUN_NONE,
      'LABEL_IN': '_TooBigEmails',
      'LABEL_OUT': '_FormerBigEmails'
    };

    ConfigStore.instance = this;
  }

  static getInstance() {
    return ConfigStore.instance || new ConfigStore();
  }

  /**
   * Get the configuration value for the provided key.
   * @param {string} key - The configuration key.
   * @returns {string} - The value for the configuration key.
   */
  get(key) {
    let value = PropertiesService.getUserProperties().getProperty(key);
    if (value === null || value === undefined) {
      if (this.CONFIGS[key] === undefined) {
        throw new Error(`Unknown configuration key: ${key}`);
      }
      
      return this.CONFIGS[key]; // Return default value if not set
    }

    return value;
  }

  /**
   * Set the configuration value for the provided key.
   * @param {string} key - The configuration key.
   * @param {string} value - The value to set.
   */
  set(key, value) {
    if (this.CONFIGS[key] === undefined) {
      throw new Error(`Unknown key: ${key}`);
    }

    PropertiesService.getUserProperties().setProperty(key, value);
  }

  /**
   * Get the dry run mode configuration.
   * @returns {string} - The dry run mode value.
   */
  getDryRunMode() {
    return this.get('DRYRUN_MODE');
  }

  /**
   * Set the dry run mode configuration.
   * @param {string} value - The value to set for dry run mode.
   */
  setDryRunMode(value) {
    this.set('DRYRUN_MODE', value);
  }

  /**
   * Get the input label configuration.
   * @returns {string} - The input label value.
   */
  getLabelIn() {
    return this.get('LABEL_IN');
  }

  /**
   * Set the input label configuration.
   * @param {string} value - The value to set for the input label.
   */
  setLabelIn(value) {
    this.set('LABEL_IN', value);
  }

  /**
   * Get the output label configuration.
   * @returns {string} - The output label value.
   */
  getLabelOut() {
    return this.get('LABEL_OUT');
  }

  /**
   * Set the output label configuration.
   * @param {string} value - The value to set for the output label.
   */
  setLabelOut(value) {
    this.set('LABEL_OUT', value);
  }
}