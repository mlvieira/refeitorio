import * as Notifications from 'expo-notifications';
import { DateTime } from 'luxon';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const DEADLINE_HOURS = Constants.expoConfig.extra.DEADLINE_HOURS;
const DEADLINE_MINUTES = Constants.expoConfig.extra.DEADLINE_MINUTES;

class HomeController {
  async requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  }

  async scheduleNotification(user) {
    if (!user) return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    const existingNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    if (existingNotifications) {
      return;
    }

    const now = DateTime.now().setZone('America/Sao_Paulo');
    const scheduledTime = now.set({
      hour: DEADLINE_HOURS,
      minute: DEADLINE_MINUTES - 30,
      second: 0,
      millisecond: 0,
    });

    if (now < scheduledTime) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Confirmação',
          body: `Não se esqueça de confirmar seu almoço antes das ${DEADLINE_HOURS}:${DEADLINE_MINUTES}!`,
          sound: 'default',
        },
        trigger: { seconds: scheduledTime.toSeconds() - now.toSeconds() },
      });
    }
  }

  handleSecureNavigation(navigation, screen, user, requiredRole, params = {}) {
    if (user?.role < requiredRole) {
      Alert.alert(
        'Acesso Negado',
        'Você não tem permissão para acessar esta seção.',
      );
      return;
    }
    navigation.navigate(screen, params);
  }
}

export default new HomeController();
