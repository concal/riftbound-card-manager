import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function AuthForm() {
  const {
    error,
    loading,
    setError,
    setSignInData,
    setSignUpData,
    signIn,
    signInData,
    signUp,
    signUpData,
  } = useAuth();

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center mb-6">
        Riftbound Collection Manager
      </h1>
      <Tabs defaultValue="sign-in" onValueChange={() => setError(null)}>
        <TabsList className="w-full">
          <TabsTrigger value="sign-in" className="flex-1">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="sign-up" className="flex-1">
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signIn} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    onChange={(event) =>
                      setSignInData((data) => ({
                        ...data,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    required={true}
                    type="email"
                    value={signInData.email}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    onChange={(event) =>
                      setSignInData((data) => ({
                        ...data,
                        password: event.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required={true}
                    type="password"
                    value={signInData.password}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Start managing your collection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signUp} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signup-name">Username</Label>
                  <Input
                    id="signup-name"
                    onChange={(event) =>
                      setSignUpData((data) => ({
                        ...data,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Username"
                    required={true}
                    type="text"
                    value={signUpData.name}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    onChange={(event) =>
                      setSignUpData((data) => ({
                        ...data,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    required={true}
                    type="email"
                    value={signUpData.email}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    onChange={(event) =>
                      setSignUpData((data) => ({
                        ...data,
                        password: event.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required={true}
                    type="password"
                    value={signUpData.password}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account…' : 'Sign Up'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
