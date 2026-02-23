import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Journal } from './pages/Journal';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManagement } from './pages/admin/UsersManagement';
import { PsychologistsManagement } from './pages/admin/PsychologistsManagement';
import { ConsultationsManagement } from './pages/admin/ConsultationsManagement';
import { FinancialTracking } from './pages/admin/FinancialTracking';
import { CommunicationCenter } from './pages/admin/CommunicationCenter';

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.type !== 'admin') return <Navigate to="/dashboard" />;
    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/journal"
                            element={
                                <PrivateRoute>
                                    <Journal />
                                </PrivateRoute>
                            }
                        />
                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminRoute>
                                    <UsersManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/psychologists"
                            element={
                                <AdminRoute>
                                    <PsychologistsManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/consultations"
                            element={
                                <AdminRoute>
                                    <ConsultationsManagement />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/financials"
                            element={
                                <AdminRoute>
                                    <FinancialTracking />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/communications"
                            element={
                                <AdminRoute>
                                    <CommunicationCenter />
                                </AdminRoute>
                            }
                        />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
