import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { fetchUserObjectives } from '~/lib/supabase';
import { Objective } from '~/lib/types/objectives';
import { useAuth } from '~/lib/useAuth';
import { formatCurrency } from '~/lib/utils/currency';





export default function ObjectivesHistoryScreen() {
  const { user } = useAuth();
  const [objectives, setObjectives] = React.useState<Objective[]>([]);
  const [loading, setLoading] = React.useState(true);
   const startDate = React.useRef('');
   const endDate =React.useRef('');

  React.useEffect(() => {
    async function loadObjectives() {
      if (user?.id) {
        const { data } = await fetchUserObjectives(user.id);
        if (data) {
          setObjectives(data);

        }
        setLoading(false);
      }
    }
    loadObjectives();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading objectives...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Objectives History</Text>
        <Text className="text-muted-foreground">Past financial objectives and their results</Text>
      </View>

      {objectives.map((objective) => {
         const startDate = new Date(objective.start_date).toLocaleDateString();
         const endDate = new Date(objective.end_date).toLocaleDateString();

         return (
            <Card key={objective.id} className="mb-4">
               <CardHeader>
                  <CardTitle>{objective.title}</CardTitle>
                  <Text className="text-muted-foreground">
                    {startDate} - {endDate}
                  </Text>
               </CardHeader>
               <CardContent>
                  <View className="space-y-4">
                     <View className="flex-row justify-between items-center">
                        <Text className="font-medium">Goal: {formatCurrency(objective.goal)}</Text>
                        <Text
                           className={`text-sm ${objective.status === 'completed' ? 'text-green-600' : objective.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}
                        >
                           {objective.status.charAt(0).toUpperCase() + objective.status.slice(1).replace('_', ' ')}
                        </Text>
                     </View>
                     <Progress
                        value={objective.progression}
                        className="h-2"
                        indicatorClassName={`${objective.status === 'completed' ? 'bg-green-600' : objective.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`} />
                     <Text className="text-sm text-right text-muted-foreground">
                        {objective.progression}% Complete
                     </Text>
                  </View>
               </CardContent>
            </Card>
         );
      })}
    </ScrollView>
  );
}
