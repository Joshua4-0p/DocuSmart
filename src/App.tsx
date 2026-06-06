import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/layouts/ProtectedRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/app/DashboardPage'
import { ProfileHubPage } from '@/pages/app/profile/ProfileHubPage'
import { PersonalDetailsPage } from '@/pages/app/profile/PersonalDetailsPage'
import { EducationPage } from '@/pages/app/profile/EducationPage'
import { ExperiencePage } from '@/pages/app/profile/ExperiencePage'
import { SkillsPage } from '@/pages/app/profile/SkillsPage'
import { CertificationsPage } from '@/pages/app/profile/CertificationsPage'
import { ProjectsPage } from '@/pages/app/profile/ProjectsPage'
import { VolunteerPage } from '@/pages/app/profile/VolunteerPage'
import { PublicationsPage } from '@/pages/app/profile/PublicationsPage'
import { LanguagesPage } from '@/pages/app/profile/LanguagesPage'
import { ReferencesPage } from '@/pages/app/profile/ReferencesPage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — with footer */}
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Auth pages — no footer */}
        <Route element={<PublicLayout hideFooter />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfileHubPage />} />
            <Route path="profile/personal" element={<PersonalDetailsPage />} />
            <Route path="profile/education" element={<EducationPage />} />
            <Route path="profile/experience" element={<ExperiencePage />} />
            <Route path="profile/skills" element={<SkillsPage />} />
            <Route path="profile/certifications" element={<CertificationsPage />} />
            <Route path="profile/projects" element={<ProjectsPage />} />
            <Route path="profile/volunteer" element={<VolunteerPage />} />
            <Route path="profile/publications" element={<PublicationsPage />} />
            <Route path="profile/languages" element={<LanguagesPage />} />
            <Route path="profile/references" element={<ReferencesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Redirect bare /app to dashboard */}
            <Route path="app" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
