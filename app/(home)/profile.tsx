import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { SignOutButton } from '~/components/SignOutButton';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { fetchUserObjectives } from '~/lib/supabase';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';

const GITHUB_AVATAR_URI =
  'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg';

export default function ProfileScreen() {
  const { user } = useAuth();
  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : '';
  const [objective, setObjective] = React.useState<{ goal: number; progression: number } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadObjectives() {
      if (user?.id) {
        const { data } = await fetchUserObjectives(user.id);
        if (data && data.length > 0) {
          const latestObjective = data[0];
          setObjective({
            goal: latestObjective.goal,
            progression: latestObjective.progression
          });
        }
        setLoading(false);
      }
    }
    loadObjectives();
  }, [user]);

  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Profile</Text>
        <Text className="text-muted-foreground">Manage your account settings</Text>
      </View>

      <Card className="mb-4">
        <CardHeader className="items-center">
          <Avatar alt={`${user?.email}'s Avatar`} className="mb-4 w-24 h-24">
            <AvatarImage source={{ uri: user?.user_metadata?.avatar_url }} />
            <AvatarFallback>
              <Text>{userInitials}</Text>
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user?.user_metadata?.full_name || user?.email}</CardTitle>
          <Text className="text-muted-foreground">{user?.email}</Text>
        </CardHeader>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Today's Financial Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-6">
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium">Daily Revenue Goal</Text>
                <Text className="text-sm font-semibold">{objective ? formatCurrency(objective.goal) : '-'}</Text>
              </View>
              {objective && (
                <>
                  <Progress
                    value={objective.progression}
                    className="h-2"
                    indicatorClassName="bg-green-600"
                  />
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted-foreground">Current: {formatCurrency(objective.goal * (objective.progression / 100))}</Text>
                    <Text className="text-sm text-muted-foreground">{objective.progression}% Complete</Text>
                  </View>
                </>
              )}
            </View>
            <Button
              onPress={() => router.push('/objectives-history')}
              variant="outline"
              className="w-full"
            >
              <Text>View Objectives History</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="items-center py-4">
          <SignOutButton />
        </CardContent>
      </Card>
    </ScrollView>
  );
}
