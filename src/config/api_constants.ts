export class ApiConstants {
  static readonly baseUrl = import.meta.env.VITE_API_BASE_URL;
  static readonly apiPath = 'api';
  
  // Auth endpoints
  static get login(): string {
    return `${this.baseUrl}/${this.apiPath}/auth/login`;
  }
  static get register(): string {
    return `${this.baseUrl}/${this.apiPath}/auth/register`;
  }
  static get refreshToken(): string {
    return `${this.baseUrl}/${this.apiPath}/auth/refresh`;
  }
  static get logout(): string {
    return `${this.baseUrl}/${this.apiPath}/auth/logout`;
  }
  static get users(): string {
    return `${this.baseUrl}/${this.apiPath}/users`;
  }
  static get achievements(): string {
    return `${this.baseUrl}/${this.apiPath}/achievements`;
  }
  static get challenges(): string {
    return `${this.baseUrl}/${this.apiPath}/challenges`;
  }
}