import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lang, t } from "@/lib/i18n";

export default function Privacy() {
  const [lang, setLang] = useState<Lang>("pt");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="container mx-auto px-4 py-16 max-w-3xl flex-1">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-8">
          {t(lang, "privacy_title")}
        </h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 leading-relaxed">
          {lang === "pt" ? (
            <>
              <p>Última atualização: Fevereiro de 2025</p>
              <h2 className="font-display font-bold text-lg text-foreground">1. Informações coletadas</h2>
              <p>Coletamos informações que você fornece voluntariamente ao cadastrar seu negócio ou enviar sugestões, incluindo nome, e-mail, telefone, WhatsApp e informações do seu negócio.</p>
              <h2 className="font-display font-bold text-lg text-foreground">2. Uso das informações</h2>
              <p>Utilizamos suas informações para exibir seu perfil no diretório, processar sugestões e melhorar nossos serviços. Não vendemos seus dados a terceiros.</p>
              <h2 className="font-display font-bold text-lg text-foreground">3. Proteção de dados</h2>
              <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração ou destruição.</p>
              <h2 className="font-display font-bold text-lg text-foreground">4. Contato</h2>
              <p>Para questões sobre privacidade, entre em contato conosco através do formulário de sugestões disponível no site.</p>
            </>
          ) : (
            <>
              <p>Last updated: February 2025</p>
              <h2 className="font-display font-bold text-lg text-foreground">1. Information collected</h2>
              <p>We collect information you voluntarily provide when registering your business or sending suggestions, including name, email, phone, WhatsApp, and business information.</p>
              <h2 className="font-display font-bold text-lg text-foreground">2. Use of information</h2>
              <p>We use your information to display your profile in the directory, process suggestions, and improve our services. We do not sell your data to third parties.</p>
              <h2 className="font-display font-bold text-lg text-foreground">3. Data protection</h2>
              <p>We implement security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
              <h2 className="font-display font-bold text-lg text-foreground">4. Contact</h2>
              <p>For privacy-related questions, please contact us through the suggestion form available on the website.</p>
            </>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
