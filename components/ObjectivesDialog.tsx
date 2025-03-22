import * as React from 'react';
import { View } from 'react-native';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { fetchUserObjectives } from '~/lib/supabase';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ObjectivesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ObjectivesDialog({ open, onOpenChange }: ObjectivesDialogProps) {
  const { user } = useAuth();
  const [objective, setObjective] = React.useState<{ goal: number; progression: number } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadObjectives = React.useCallback(async () => {
    if (user?.id) {
      setRefreshing(true);
      const { data } = await fetchUserObjectives(user.id);
      if (data && data.length > 0) {
        const latestObjective = data[0];
        setObjective({
          goal: latestObjective.goal,
          progression: latestObjective.progression
        });
      }
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadObjectives();
  }, [loadObjectives, open]);

  if (loading) {
    return null;
  }

  if (!objective) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Today's Financial Objective</DialogTitle>
        </DialogHeader>
        <View className="py-6 space-y-8">
          <View className="items-center space-y-3">
            <Text className="text-4xl font-bold text-primary">
              {formatCurrency(objective.goal)}
            </Text>
            <Text className="text-sm text-muted-foreground">Daily Revenue Goal</Text>
          </View>

          <View className="space-y-5">
            <Progress
              value={objective.progression}
              className="h-3"
              indicatorClassName="bg-green-600"
            />
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-muted-foreground">Current: {formatCurrency(objective.goal * (objective.progression / 100))}</Text>
              <Text className="text-sm text-muted-foreground">{objective.progression}% Complete</Text>
            </View>
          </View>

          <Button
            className="mt-2 w-full"
            onPress={() => onOpenChange(false)}
          >
            <Text>Confirm</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
