import { HttpProvider } from '@/providers/http.provider';
import { NotFoundError } from '@/errors';

export interface L2BeatRisk {
  name: string;
  value: string;
  sentiment: 'good' | 'warning' | 'bad' | 'neutral' | 'UnderReview';
  description: string;
}

export interface L2BeatBadge {
  id: string;
  type: string;
  name: string;
  description: string;
}

export interface L2BeatTvsBreakdown {
  total: number;
  native: number;
  canonical: number;
  external: number;
  ether: number;
  stablecoin: number;
  btc: number;
  other: number;
}

export interface L2BeatProject {
  id: string;
  name: string;
  slug: string;
  type: string;
  hostChain: string | null;
  category: string;
  providers: string[];
  purposes: string[];
  isArchived: boolean;
  isUpcoming: boolean;
  isUnderReview: boolean;
  badges: L2BeatBadge[];
  stage: string | null;
  risks: L2BeatRisk[];
  tvs: {
    breakdown: L2BeatTvsBreakdown;
    change7d: number;
  } | null;
}

export interface L2BeatScalingSummary {
  chart: { types: string[]; data: number[][] };
  projects: Record<string, L2BeatProject>;
}

export interface L2BeatTvsData {
  usdValue: number;
  ethValue: number;
  chart: { types: string[]; data: number[][] };
}

export interface L2BeatActivityData {
  chart: { types: ['timestamp', 'count', 'uopsCount']; data: [number, number, number][] };
}

/**
 * Service for L2Beat analytics data
 * Uses the unofficial public API at https://l2beat.com/api
 */
export class L2BeatService {
  private http: HttpProvider;
  private static readonly BASE_URL = 'https://l2beat.com';

  constructor() {
    this.http = new HttpProvider(L2BeatService.BASE_URL);
  }

  /**
   * Get all scaling projects with metadata and TVS
   * @returns Scaling summary with all projects
   */
  async getScalingSummary(): Promise<L2BeatScalingSummary> {
    const response = await this.http.get<L2BeatScalingSummary>('/api/scaling/summary');
    return response.data;
  }

  /**
   * Get aggregate TVS (Total Value Secured) across all L2s
   * @returns Aggregate TVS with USD/ETH values and chart data
   */
  async getScalingTvs(): Promise<L2BeatTvsData> {
    const response = await this.http.get<{ success: boolean; data: L2BeatTvsData }>(
      '/api/scaling/tvs'
    );
    return response.data.data;
  }

  /**
   * Get aggregate transaction activity across all L2s (last 30 days)
   * @returns Activity chart data with daily tx counts and uops counts
   */
  async getScalingActivity(): Promise<L2BeatActivityData> {
    const response = await this.http.get<{ success: boolean; data: L2BeatActivityData }>(
      '/api/scaling/activity'
    );
    return response.data.data;
  }

  /**
   * Get a single project by slug
   * @param slug - Project slug (e.g. "arbitrum", "optimism")
   * @returns Project details
   * @throws {NotFoundError} If project slug is not found
   */
  async getProject(slug: string): Promise<L2BeatProject> {
    const summary = await this.getScalingSummary();
    const project = summary.projects[slug.toLowerCase()];

    if (!project) {
      const examples = Object.keys(summary.projects).slice(0, 5).join(', ');
      throw new NotFoundError(`Project "${slug}" not found. Try slugs like: ${examples}...`);
    }

    return project;
  }
}
