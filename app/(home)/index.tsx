import * as ImagePicker from 'expo-image-picker';
import { Link } from 'expo-router';
import * as React from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { supabase } from '~/lib/utils';

export default function Screen() {
  const [image, setImage] = React.useState<string | null>(null);
  const [total, setTotal] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets![0].uri);
    }
  };

  const uploadReceipt = async () => {
    if (!image || !total) {
      Alert.alert('Error', 'Please capture an image and enter the total amount');
      return;
    }

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const file = {
        uri: image,
        name: `receipt-${Date.now()}.jpg`,
        type: 'image/jpeg',
      };

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

      const { data: storageData, error: storageError } = await supabase.storage
        .from('receipts')
        .upload(`${user.data.user.id}/${file.name}`,formData);

      if (storageError) {
        const errorMessage = storageError.message || 'Failed to upload image to storage';
        Alert.alert('Storage Error', errorMessage);
        return;
      }

      const { data: {publicUrl} } = supabase.storage
        .from('receipts')
        .getPublicUrl(`${user.data.user.id}/${file.name}`);

      const { error: dbError } = await supabase
        .from('rbms_records')
        .insert({
          user_id: user.data.user.id,
          picture: publicUrl,
          total: total,

        });

      if (dbError) {
        const errorMessage = dbError.message || 'Failed to save receipt data';
        console.error(errorMessage);
        Alert.alert('Database Error', errorMessage);
        return;
      }

      Alert.alert('Success', 'Receipt uploaded successfully');
      setImage(null);
      setTotal('');
    } catch (error:any) {
      const errorMessage = error || 'An unexpected error occurred';
      console.error(`error: ${error}`);

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {image ? (
          <View className="flex-1 justify-center items-center p-4">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Review Receipt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <View className="overflow-hidden h-64 rounded-lg bg-muted">
                  <Image
                    src={image}
                    className="w-full h-full"
                  //   contentFit="cover"
                  //   transition={1000}
                  />
                </View>
                <View className="space-y-2">
                  <Text className="text-sm font-medium">Total Amount</Text>
                  <TextInput
                    className="px-3 py-2 h-10 text-sm rounded-md border border-input bg-background"
                    placeholder="Enter total amount"
                    keyboardType="decimal-pad"
                    value={total}
                    onChangeText={setTotal}
                  />
                </View>
              </CardContent>
              <CardFooter className="flex-row justify-between">
                <Button
                  variant="outline"
                  onPress={() => setImage(null)}
                  disabled={loading}
                >
                  <Text>Retake</Text>
                </Button>
                <Button onPress={uploadReceipt} disabled={loading}>
                  <Text className="text-primary-foreground">
                    {loading ? 'Uploading...' : 'Upload'}
                  </Text>
                </Button>
              </CardFooter>
            </Card>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Button className="mb-4" onPress={pickImage}>
              <Text className="text-primary-foreground">Select Receipt</Text>
            </Button>
            <Link href="/history" asChild>
              <Button variant="outline">
                <Text>View History</Text>
              </Button>
            </Link>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
