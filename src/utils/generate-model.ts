/**
 * Generic data model generator utility
 * Converts any data source to a standardized model format
 */

/**
 * Generic model interface that can be extended for specific use cases
 */
export interface BaseModel {
  id: string | number;
  [key: string]: any;
}

/**
 * Field mapping type for mapping source data fields to target model fields
 * @template T - The target model type
 */
export type FieldMapping<T extends BaseModel> = {
  [K in keyof T]?: string[];
};

/**
 * Transform options for customizing the model generation process
 * @template T - The target model type
 */
export interface TransformOptions<T extends BaseModel> {
  /** Custom transformers for specific fields */
  transformers?: {
    [K in keyof T]?: (value: any, sourceItem: any) => any;
  };
  /** Default values for the model */
  defaults?: Partial<T>;
  /** Additional processing to perform on the model after generation */
  postProcess?: (model: T, sourceItem: any, index: number) => T;
}

/**
 * Generates a standardized model from any data source
 * @template T - The target model type
 * @template S - The source data item type (defaults to any)
 * @param data - Array of source data items
 * @param fieldMapping - Mapping from source fields to target model fields
 * @param options - Additional options for transformation
 * @returns Array of generated models
 */
export function generateModel<T extends BaseModel, S extends Record<string, any> = Record<string, any>>(
  data: S[],
  fieldMapping: FieldMapping<T>,
  options: TransformOptions<T> = {}
): T[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  // Merge options with defaults
  const mergedOptions: TransformOptions<T> = {
    transformers: options.transformers || {},
    defaults: options.defaults || {},
    postProcess: options.postProcess
  };

  return data.map((item, index) => {
    // Create a new model with defaults
    const model = { ...mergedOptions.defaults } as Partial<T>;

    // Process each field in the mapping
    Object.entries(fieldMapping).forEach(([field, sourceFields]) => {
      if (!sourceFields || !Array.isArray(sourceFields)) return;
      
      // Find the first defined value from source fields
      let value: any = undefined;
      for (const key of sourceFields) {
        // Handle nested properties using dot notation (e.g., "user.name")
        if (key.includes('.')) {
          const parts = key.split('.');
          let nestedValue = item as Record<string, any>;
          let found = true;
          
          for (const part of parts) {
            if (nestedValue && typeof nestedValue === 'object' && part in nestedValue) {
              nestedValue = nestedValue[part];
            } else {
              found = false;
              break;
            }
          }
          
          if (found && nestedValue !== undefined) {
            value = nestedValue;
            break;
          }
        } else if (item && typeof item === 'object' && key in item) {
          value = item[key];
          break;
        }
      }

      // Use index as id if not found
      if (value === undefined && field === 'id') {
        value = index;
      }

      // Apply custom transformer if available
      const transformer = mergedOptions.transformers?.[field as keyof T];
      if (transformer && typeof transformer === 'function') {
        value = transformer(value, item);
      }

      // Add value to model if defined
      if (value !== undefined) {
        model[field as keyof T] = value;
      }
    });

    // Apply post-processing if provided
    const result = model as T;
    if (mergedOptions.postProcess && typeof mergedOptions.postProcess === 'function') {
      return mergedOptions.postProcess(result, item, index);
    }

    return result;
  });
}

/**
 * Example data model (for backward compatibility)
 */
export interface DataModel extends BaseModel {
  title: string;
  domain: string;
  author: string;
  description: string;
  cover: string;
  link: string;
  lastUpdate: string;
  tags: string[];
  value?: string;
}

/**
 * Legacy options for DataModel generation
 */
export interface DataModelTransformOptions extends TransformOptions<DataModel> {
  addRefToLink?: boolean;
  refParam?: string;
}

/**
 * Default field mapping for DataModel
 */
export const defaultDataModelMapping: FieldMapping<DataModel> = {
  id: ["collectionId", "guid", "_id", "id"],
  title: ["title"],
  domain: ["domain"],
  author: ["author", "creator"],
  description: ["description", "excerpt", "content", "summary"],
  cover: ["cover", "image", "thumbnail"],
  link: ["link", "url"],
  lastUpdate: ["lastUpdate", "pubDate", "updated", "date"],
  tags: ["tags", "categories", "keywords"],
  value: ["value"]
};

/**
 * Generates a DataModel from any data source (legacy function for backward compatibility)
 * @param data - Array of source data items
 * @param fieldMapping - Mapping from source fields to DataModel fields
 * @param options - Additional options for transformation
 * @returns Array of DataModel objects
 */
export const generateDataModel = (
  data: any[],
  fieldMapping: FieldMapping<DataModel> = {},
  options: DataModelTransformOptions = {}
): DataModel[] => {
  // Default options
  const defaultOptions: DataModelTransformOptions = {
    addRefToLink: true,
    refParam: "?ref=bookmarksfor.dev",
  };

  // Merge options
  const mergedOptions: DataModelTransformOptions = {
    ...defaultOptions,
    ...options,
    transformers: { ...options.transformers },
    defaults: { ...options.defaults }
  };

  // Create post-processor for link modification
  const postProcess = (model: DataModel, _: any, __: number): DataModel => {
    if (model.link && mergedOptions.addRefToLink && mergedOptions.refParam) {
      model.link = `${model.link}${mergedOptions.refParam}`;
    }
    return model;
  };

  // Merge field mappings
  const mergedMapping: FieldMapping<DataModel> = { 
    ...defaultDataModelMapping 
  };
  
  // Add user-provided mappings
  Object.entries(fieldMapping).forEach(([key, value]) => {
    if (value && Array.isArray(value)) {
      mergedMapping[key as keyof DataModel] = value;
    }
  });

  // Use the generic function with DataModel specifics
  return generateModel<DataModel>(
    data,
    mergedMapping,
    {
      ...mergedOptions,
      postProcess
    }
  );
};