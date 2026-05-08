export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  providerName?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt?: string;
  projectCount: number;
}

export interface OrganizationDetail {
  id: string;
  name: string;
  slug?: string;
  owner: User;
  createdAt: string;
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  schemaCount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  organizationName: string;
  createdAt: string;
  updatedAt?: string;
  schemaCount: number;
  totalRecords: number;
}

export interface ProjectDetail {
  id: string;
  name: string;
  slug?: string;
  organization: {
    id: string;
    name: string;
  };
  createdAt: string;
  schemas: MockSchemaSummary[];
  stats: ProjectStats;
}

export interface ProjectStats {
  totalSchemas: number;
  totalRecords: number;
  activeRecords: number;
  expiredRecords: number;
}

export interface MockSchemaSummary {
  id: string;
  name: string;
  recordCount: number;
  createdAt: string;
}

export interface MockSchema {
  id: string;
  name: string;
  slug: string;
  projectId: string;
  projectName: string;
  schemaJson: Record<string, object>;
  createdAt: string;
  recordCount: number;
  endpointUrl: string;
}

export interface SchemaTemplate {
  schema: {};
  category: string | undefined;
  id: string;
  name: string;
  slug: string;
  description?: string;
  schemaJson: Record<string, object>;
  createdAt: string;
}

export interface MockSchemaDetail {
  id: string;
  name: string;
  slug?: string;
  project: {
    id: string;
    name: string;
    organizationName: string;
  };
  schemaJson: Record<string, object>;
  createdAt: string;
  stats: SchemaStats;
  recentRecords: MockRecordSummary[];
}

export interface SchemaStats {
  totalRecords: number;
  activeRecords: number;
  expiredRecords: number;
  oldestRecord?: string;
  newestRecord?: string;
}

export interface MockRecordSummary {
  id: string;
  data: Record<string, any>;
  createdAt: string;
  expiresAt: string;
  expired: boolean;
}

export interface MockRecord {
  id: string;
  schemaId: string;
  schemaName: string;
  data: Record<string, any>;
  createdAt: string;
  expiresAt: string;
  expired: boolean;
  ttlMinutes: number;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  validationErrors?: Record<string, string[]>;
}

export interface UserStats {
  organizationCount: number;
  projectCount: number;
  schemaCount: number;
  recordCount: number;
}

export interface OrganizationStats {
  projectCount: number;
  schemaCount: number;
  recordCount: number;
}

export interface ProjectStats {
  schemaCount: number;
  recordCount: number;
  activeRecords: number;
  expiredRecords: number;
}

export interface SchemaStats {
  recordCount: number;
  activeRecords: number;
  expiredRecords: number;
  expiringSoonRecords: number;
}


export interface RecordHealthStats {
  totalRecords: number;
  totalActiveRecords: number;
  totalExpiredRecords: number;
  totalExpiringSoonRecords: number;
}
export interface ApplyTemplateResponse {
  schemaId: string;
  name: string;
  schemaSlug: string;
  projectId: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// API KEY TYPES

/**
 * Hierarchical permission levels.
 * Server enforces: ADMIN ≥ DELETE ≥ WRITE ≥ READ
 */
export type ApiPermission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

/** Resource types that can be targeted by a permission grant */
export type ApiResourceType = 'ORGANIZATION' | 'PROJECT' | 'SCHEMA' | 'RECORD';

/**
 * Permission entry
 */
export interface ApiKeyPermissionEntry {
  id: string;

  resourceType: ApiResourceType;
  resourceName?: string;

  permission: ApiPermission;

  /** Undefined/null = wildcard (all resources of this type) */
  resourceId?: string;
}

/**
 * Represents a persisted API key
 */
export interface ApiKeyResponse {
  id: string;
  name: string;
  description?: string;

  /** Visible prefix shown in the UI */
  keyPrefix: string;

  organizationId: string;
  organizationName: string;

  /** Set = project-scoped; null = org-wide */
  projectId?: string;
  projectName?: string;

  createdBy: string;
  createdByName: string;

  permissions: ApiKeyPermissionEntry[];

  rateLimitPerMinute: number;

  /** false after revocation */
  active: boolean;

  /** ISO-8601 datetime; absent = never expires */
  expiresAt?: string;

  /** ISO-8601 datetime */
  lastUsedAt?: string;

  createdAt: string;
  updatedAt?: string;
}

/**
 * Returned only by the create and rotate endpoints.
 * `apiKey` is the ONLY time the full secret is exposed.
 */
export interface CreateApiKeyResult {
  apiKey: string;
  keyInfo: ApiKeyResponse;

  /** Informational message from backend */
  securityNotice?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;

  /** UUID of the project to scope this key to (omit for org-wide) */
  projectId?: string;

  /** ISO-8601 future datetime */
  expiresAt?: string;

  /** Default: 1000 */
  rateLimitPerMinute?: number;

  permissions: {
    permission: ApiPermission;
    resourceType: ApiResourceType;
    resourceId?: string;
  }[];
}

export interface UpdateApiKeyRequest {
  name?: string;
  description?: string;

  rateLimitPerMinute?: number;

  /** Activate/deactivate key */
  active?: boolean;

  /** Update expiry */
  expiresAt?: string;
}