import { BaseScreens, CreateScreensOptions, CreateScreensResult } from './types'

export function createScreens<T extends BaseScreens>(
  options: CreateScreensOptions<T>
): CreateScreensResult<T> {
  const navigate = null as any
  const useNavigate = () => navigate
  return { navigate, useNavigate }
}
