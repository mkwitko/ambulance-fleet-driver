import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Animated,
  Image,
  Keyboard,
  Platform,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import KeyboardSpacer from "@/src/components/keyboard-spacer";
import { SelectCompanyModal } from "@/src/components/select-company-modal";
import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { SecureInput } from "@/src/components/ui/secure-input";
import { Typography } from "@/src/components/ui/typography";
import {
  usePreSignInDriver,
  useSignInDriver,
} from "@/src/http/generated/auth/auth";
import { useRouter } from "expo-router";

const signInSchema = z.object({
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => {
      const cleanedCpf = val.replace(/[^\d]/g, "");
      if (cleanedCpf.length !== 11) return false;

      let sum = 0;
      let remainder;

      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
      }

      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;

      return cleanedCpf.substring(9, 10) === remainder.toString();
    }),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

type Company = {
  id: string;
  name: string;
};

export default function SignIn() {
  const { mutateAsync: preSignIn } = usePreSignInDriver();
  const { mutateAsync: signIn } = useSignInDriver();
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [pendingCredentials, setPendingCredentials] =
    useState<SignInFormData | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const response = await preSignIn({
      data: {
        cpf: data.cpf,
        password: data.password,
      },
    });

    if (response.companies.length === 1) {
      await signIn({
        data: {
          cpf: data.cpf,
          password: data.password,
          companyId: response.companies[0].id,
        },
      });

      router.replace("/protected/app/driver");
      return;
    }

    if (response.companies.length > 1) {
      setCompanies(response.companies);
      setPendingCredentials(data);
      setShowCompanyModal(true);
    }
  };

  const handleConfirmCompany = async (companyId: string) => {
    if (!pendingCredentials) return;

    await signIn({
      data: {
        cpf: pendingCredentials.cpf,
        password: pendingCredentials.password,
        companyId,
      },
    });

    setShowCompanyModal(false);
    router.replace("/protected/app/driver");
  };

  // 🔥 ANIMAÇÕES DA LOGO
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const subShow = Keyboard.addListener(showEvent, () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.85,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const subHide = Keyboard.addListener(hideEvent, () => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center px-4">
      <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 220, height: 110 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* FORM */}
      <View className="w-full bg-white p-6 gap-4 rounded-xl border border-input mt-10">
        <View className="gap-1 mb-2">
          <Typography variant="title" align="center">
            Gestão de Ambulâncias
          </Typography>
          <Typography variant="subtitle" align="center">
            Acesse sua conta com CPF
          </Typography>
        </View>

        <View className="w-full">
          <FormField control={control} name="cpf" error={errors.cpf}>
            {({ value, onChange, onBlur }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Insira seu CPF"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                variant={errors.cpf ? "error" : "default"}
              />
            )}
          </FormField>

          <FormField control={control} name="password" error={errors.password}>
            {({ value, onChange, onBlur }) => (
              <SecureInput
                ref={passwordRef}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Senha"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                variant={errors.password ? "error" : "default"}
                keyboardType="numeric"
              />
            )}
          </FormField>
        </View>

        <Button
          title={isSubmitting ? "Entrando..." : "Entrar"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          className="mt-2"
        />

        <Typography variant="small" align="center" className="mt-4">
          © {new Date().getFullYear()} — Connect - Gestão de Ambulâncias
        </Typography>
      </View>

      <KeyboardSpacer />

      {/* MODAL DE SELEÇÃO DE COMPANY */}
      <SelectCompanyModal
        visible={showCompanyModal}
        companies={companies}
        isSubmitting={isSubmitting}
        onClose={() => setShowCompanyModal(false)}
        onConfirm={handleConfirmCompany}
      />
    </View>
  );
}
