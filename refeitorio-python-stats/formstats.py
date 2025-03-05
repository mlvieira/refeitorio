#!/usr/bin/env python3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

sns.set(style="whitegrid")

COLUMN_FUNCAO = "Qual a sua função?"
COLUMN_TREINAMENTO = "O treinamento foi suficiente para entender como utilizar o aplicativo?"
COLUMN_SATISFACAO = "De 1 a 5, qual o seu nível de satisfação com o aplicativo? "
COLUMN_RECOMENDACAO = "Você recomendaria o aplicativo para outras pessoas?"
COLUMN_FACILIDADE = "O aplicativo é fácil de usar?"
COLUMN_DESIGN = "O design do aplicativo é agradável e intuitivo?"
COLUMN_DIFICULDADES = 'Você encontrou dificuldades ao navegar pelo aplicativo? Se sim, selecione "Outros".'
COLUMN_FUNCIONAMENTO = "O aplicativo funciona corretamente na maioria das vezes?"
COLUMN_LENTIDAO = "Você já teve problemas com lentidão ou travamentos?"
COLUMN_FUNCIONALIDADES = "As funcionalidades oferecidas pelo aplicativo atendem às suas necessidades?"

OUTPUT_FOLDER = "../stats"

def load_data(csv_path="respostas.csv"):
    df = pd.read_csv(csv_path)
    return df

def countplot_with_hue(column, data, order, palette, orient='y'):
    if orient == 'y':
        sns.countplot(y=column, data=data, order=order, hue=column, palette=palette, dodge=False)
    else:
        sns.countplot(x=column, data=data, order=order, hue=column, palette=palette, dodge=False)
    plt.legend([], [], frameon=False)

def generate_plots(df):
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    # Distribuição das funções
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_FUNCAO].value_counts().index
    countplot_with_hue(COLUMN_FUNCAO, data=df, order=ordem, palette="viridis", orient='y')
    plt.title("Distribuição de Funções")
    plt.xlabel("Contagem")
    plt.ylabel("Função")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "funcao_distribution.png"))
    plt.show()
    
    # Treinamento foi suficiente?
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_TREINAMENTO].value_counts().index
    countplot_with_hue(COLUMN_TREINAMENTO, data=df, order=ordem, palette="coolwarm", orient='y')
    plt.title("Treinamento Suficiente?")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "treinamento_suficiente.png"))
    plt.show()
    
    # Nível de satisfação (de 1 a 5)
    df[COLUMN_SATISFACAO] = pd.to_numeric(df[COLUMN_SATISFACAO], errors="coerce")
    plt.figure(figsize=(8, 6))
    ordem = sorted(df[COLUMN_SATISFACAO].dropna().unique())
    countplot_with_hue(COLUMN_SATISFACAO, data=df, order=ordem, palette="magma", orient='x')
    plt.title("Nível de Satisfação com o Aplicativo")
    plt.xlabel("Nível")
    plt.ylabel("Contagem")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "satisfacao_distribution.png"))
    plt.show()
    
    # Recomendaria o aplicativo?
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_RECOMENDACAO].value_counts().index
    countplot_with_hue(COLUMN_RECOMENDACAO, data=df, order=ordem, palette="Set2", orient='y')
    plt.title("Recomendação do Aplicativo")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "recomendacao.png"))
    plt.show()
    
    # Facilidade de uso
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_FACILIDADE].value_counts().index
    countplot_with_hue(COLUMN_FACILIDADE, data=df, order=ordem, palette="Set3", orient='y')
    plt.title("Facilidade de Uso do Aplicativo")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "facilidade_uso.png"))
    plt.show()
    
    # Design do aplicativo
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_DESIGN].value_counts().index
    countplot_with_hue(COLUMN_DESIGN, data=df, order=ordem, palette="Spectral", orient='y')
    plt.title("Design do Aplicativo")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "design.png"))
    plt.show()
    
    # Dificuldades na navegação
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_DIFICULDADES].value_counts().index
    countplot_with_hue(COLUMN_DIFICULDADES, data=df, order=ordem, palette="cubehelix", orient='y')
    plt.title("Dificuldades ao Navegar pelo Aplicativo")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "dificuldades_navegar.png"))
    plt.show()
    
    # Funcionamento do aplicativo
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_FUNCIONAMENTO].value_counts().index
    countplot_with_hue(COLUMN_FUNCIONAMENTO, data=df, order=ordem, palette="pastel", orient='y')
    plt.title("Funcionamento do Aplicativo")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "funcionamento.png"))
    plt.show()
    
    # Problemas com lentidão ou travamentos
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_LENTIDAO].value_counts().index
    countplot_with_hue(COLUMN_LENTIDAO, data=df, order=ordem, palette="flare", orient='y')
    plt.title("Problemas de Lentidão ou Travamentos")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "lentidao_travamentos.png"))
    plt.show()
    
    # Funcionalidades atendem às necessidades
    plt.figure(figsize=(8, 6))
    ordem = df[COLUMN_FUNCIONALIDADES].value_counts().index
    countplot_with_hue(COLUMN_FUNCIONALIDADES, data=df, order=ordem, palette="spring", orient='y')
    plt.title("Atendimento das Funcionalidades às Necessidades")
    plt.xlabel("Contagem")
    plt.ylabel("Resposta")
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_FOLDER, "funcionalidades.png"))
    plt.show()

if __name__ == "__main__":
    df = load_data()
    generate_plots(df)
