import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Wallet,
  Moon,
  Sun,
  Check,
  ArrowRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner@2.0.3';

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const loginResponse = await login(formData.email, formData.password);
        toast.success(loginResponse?.message || 'Login realizado com sucesso!');
      } else {
        const registerResponse = await register(formData.name, formData.email, formData.password);
        toast.success(registerResponse?.message || 'Conta criada com sucesso!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao autenticar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças de forma clara e objetiva com gráficos elegantes.'
    },
    {
      icon: Wallet,
      title: 'Gestão de Contas',
      description: 'Gerencie múltiplas contas bancárias em um único lugar.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta a ponta.'
    },
    {
      icon: Zap,
      title: 'Rápido e Eficiente',
      description: 'Interface otimizada para máxima performance e usabilidade.'
    },
    {
      icon: Sparkles,
      title: 'Insights Inteligentes',
      description: 'Recomendações personalizadas baseadas nos seus hábitos financeiros.'
    }
  ];

  const pricing = [
    {
      name: 'Básico',
      price: 'Grátis',
      description: 'Para quem está começando',
      features: ['Gráficos e análises', 'Relatórios', 'Suporte 24/7', 'Contas ilimitadas'],
      popular: true
    },
    {
      name: 'Pro',
      price: 'R$ 29/mês',
      description: 'Para usuários avançados',
      features: ['Em breve'],
      popular: false,
      locked: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-sidebar border-b border-sidebar-border">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-[20px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:block">
              FinFácil
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => { setShowAuth(true); setAuthMode('login'); }}
                className="rounded-full text-sm px-3 hidden sm:inline-flex"
              >
                Entrar
              </Button>
              <Button
                onClick={() => { setShowAuth(true); setAuthMode('register'); }}
                className="rounded-full text-sm px-3 sm:px-4"
              >
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Gestão financeira inteligente
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Controle total das<br />suas finanças
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Gerencie suas contas, investimentos e despesas de forma simples e elegante. 
              Tenha insights poderosos na palma da sua mão.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
              <Button
                size="lg"
                onClick={() => { setShowAuth(true); setAuthMode('register'); }}
                className="rounded-full shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all text-lg px-6 sm:px-8 w-full sm:w-auto"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 ml-2 hidden sm:inline" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Recursos Incríveis
            </h2>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para gerenciar suas finanças
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 border-sidebar-border rounded-[20px] group backdrop-blur-xl"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-[16px] flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para você
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 rounded-[24px] transition-all duration-300 backdrop-blur-xl ${
                  plan.popular
                    ? 'border-primary shadow-2xl shadow-primary/20 scale-105'
                    : 'border-sidebar-border'
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <span className="text-sm font-medium text-primary">
                      Mais Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${
                    plan.popular
                      ? 'shadow-lg shadow-primary/30'
                      : plan.locked
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={plan.locked}
                  onClick={() => {
                    if (!plan.locked) {
                      setShowAuth(true);
                      setAuthMode('register');
                    }
                  }}
                >
                  {plan.locked ? 'Indisponível' : 'Começar Agora'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card/50 backdrop-blur-sm border-t border-sidebar-border">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-[16px] flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary">
              FinFácil
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2026 FinFácil. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-8 rounded-[24px] shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {authMode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
              </h2>
              <p className="text-muted-foreground">
                {authMode === 'login' 
                  ? 'Entre para acessar suas finanças'
                  : 'Cadastre-se para começar'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl shadow-lg shadow-primary/30"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-primary hover:underline"
              >
                {authMode === 'login' 
                  ? 'Não tem uma conta? Criar agora' 
                  : 'Já tem uma conta? Entrar'}
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              ✕
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
