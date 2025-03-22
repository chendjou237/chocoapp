import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { formatCurrency } from '~/lib/utils/currency';

type Objective = {
  id: string;
  title: string;
  goal: number;
  progression: number;
  status: 'completed' | 'in_progress' | 'failed';
  start_date: string;
  end_date: string;
};

// Mock data for past objectives
const pastObjectives: Objective[] = [
  {
    id: '1',
    title: 'Q1 Revenue Target',
    goal: 50000,
    progression: 100,
    status: 'completed',
    start_date: '2024-01-01',
    end_date: '2024-03-31'
  },
  {
    id: '2',
    title: 'February Sales Goal',
    goal: 20000,
    progression: 85,
    status: 'completed',
    start_date: '2024-02-01',
    end_date: '2024-02-29'
  },
  {
    id: '3',
    title: 'January Target',
    goal: 15000,
    progression: 60,
    status: 'failed',
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  }
];

export default function ObjectivesHistoryScreen() {
  return (
    <ScrollView className="flex-1 p-4 bg-secondary/30">
      <View className="mb-4">
        <Text className="text-2xl font-bold">Objectives History</Text>
        <Text className="text-muted-foreground">Past financial objectives and their results</Text>
      </View>

      {pastObjectives.map((objective) => (
        <Card key={objective.id} className="mb-4">
          <CardHeader>
            <CardTitle>{objective.title}</CardTitle>
            <Text className="text-muted-foreground">
              {objective.start_date} - {objective.end_date}
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
                indicatorClassName={`${objective.status === 'completed' ? 'bg-green-600' : objective.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`}
              />
              <Text className="text-sm text-right text-muted-foreground">
                {objective.progression}% Complete
              </Text>
            </View>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
}
