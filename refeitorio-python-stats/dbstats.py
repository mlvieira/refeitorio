#!/usr/bin/env python3
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sns.set(style="whitegrid")

ROLE_HUMAN = {
    1: 'Funcionário',
    2: 'Cozinheiro',
    3: 'RH'
}

DIAS_SEMANA = {
    'Monday': 'Segunda-feira',
    'Tuesday': 'Terça-feira',
    'Wednesday': 'Quarta-feira',
    'Thursday': 'Quinta-feira',
    'Friday': 'Sexta-feira'
}

def load_data(db_path='../database.sqlite'):
    conexao = sqlite3.connect(db_path)
    
    df_funcionarios = pd.read_sql_query("SELECT id, role FROM funcionarios", conexao)
    df_presencas = pd.read_sql_query("SELECT id, funcionario_id, presenca, data FROM presencas", conexao)
    
    conexao.close()
    return df_funcionarios, df_presencas

def clean_data(df_funcionarios, df_presencas):
    df = df_presencas.merge(
        df_funcionarios, 
        how='inner',
        left_on='funcionario_id', 
        right_on='id', 
        suffixes=('_presenca', '_funcionario'),
        validate='many_to_one'
    )

    df['data'] = pd.to_datetime(df['data']).dt.strftime('%d-%m-%Y')
    
    return df

def generate_plots(df, df_funcionarios):
    # Contagem de Presenças Diárias
    presenca_diaria = df.groupby('data')['presenca'].sum()
    plt.figure(figsize=(10, 5))
    presenca_diaria.plot(kind='bar', color='skyblue')
    plt.title('Contagem de Presenças Diárias')
    plt.xlabel('Data')
    plt.ylabel('Número de Funcionários Presentes')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('../stats/contagem_presencas_diarias.png')
    plt.show()

    # Distribuição de Respostas Diárias
    total_funcionarios = df_funcionarios['id'].nunique()
    daily_stats = df.groupby('data').agg(
        presentes=('presenca', 'sum'),
        total_respostas=('presenca', 'count')
    )
    daily_stats['ausentes'] = daily_stats['total_respostas'] - daily_stats['presentes']
    daily_stats['nao_confirmados'] = total_funcionarios - daily_stats['total_respostas']
    daily_stats = daily_stats.sort_index()

    plt.figure(figsize=(12, 5))
    plt.bar(daily_stats.index, daily_stats['presentes'], label='Presentes', color='green')
    plt.bar(daily_stats.index, daily_stats['ausentes'], bottom=daily_stats['presentes'],
            label='Ausentes', color='red')
    plt.bar(daily_stats.index, daily_stats['nao_confirmados'],
            bottom=daily_stats['presentes']+daily_stats['ausentes'],
            label='Não Confirmados', color='gray')
    plt.title('Distribuição de Respostas Diárias')
    plt.xlabel('Data')
    plt.ylabel('Número de Funcionários')
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.savefig('../stats/distribuicao_respostas_diarias.png')
    plt.show()

    # Média de Presença por Cargo
    presenca_por_cargo = df.groupby('role')['presenca'].mean()
        
    presenca_por_cargo.index = presenca_por_cargo.index.map(ROLE_HUMAN)

    plt.figure(figsize=(8, 4))
    sns.barplot(x=presenca_por_cargo.index, y=presenca_por_cargo.values, hue=presenca_por_cargo.index,
        palette="coolwarm", legend=False)
    plt.title('Média de Presença por Cargo')
    plt.xlabel('Cargo')
    plt.ylabel('Média de Presença')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('../stats/media_presenca_cargo.png')
    plt.show()

    # Média de Presença por Dia da Semana
    df['dia_da_semana'] = pd.to_datetime(df['data'], format='%d-%m-%Y').dt.day_name()
    dias_uteis = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    presenca_dia_semana = df[df['dia_da_semana'].isin(dias_uteis)].groupby('dia_da_semana')['presenca'].mean()
    presenca_dia_semana = presenca_dia_semana.reindex(dias_uteis)

    presenca_dia_semana.index = presenca_dia_semana.index.map(DIAS_SEMANA)

    plt.figure(figsize=(8, 4))
    sns.barplot(x=presenca_dia_semana.index, y=presenca_dia_semana.values, hue=presenca_dia_semana.index,
        palette="viridis", legend=False)
    plt.title('Média de Presença por Dia da Semana')
    plt.xlabel('Dia da Semana')
    plt.ylabel('Média de Presença')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('../stats/media_presenca_dia_semana.png')
    plt.show()

    # Distribuição de Não Confirmações por Funcionário
    num_dias_trabalho = df['data'].nunique()
    respostas_por_funcionario = df.groupby('funcionario_id')['presenca'].count()

    df_agg = pd.DataFrame({'funcionario_id': df_funcionarios['id']})
    df_agg = df_agg.merge(respostas_por_funcionario.rename('respostas'),
                          on='funcionario_id', how='left', validate='one_to_one')
    df_agg['respostas'] = df_agg['respostas'].fillna(0)
    df_agg['nao_confirmacoes'] = num_dias_trabalho - df_agg['respostas']

    plt.figure(figsize=(8, 4))
    sns.histplot(df_agg['nao_confirmacoes'], bins=range(0, num_dias_trabalho+1), discrete=True, kde=False, color='gray')
    plt.title('Distribuição de Não Confirmações por Funcionário')
    plt.xlabel('Número de Dias sem Confirmação')
    plt.ylabel('Número de Funcionários')
    plt.tight_layout()
    plt.savefig('../stats/distribuicao_nao_confirmacoes_funcionario.png')
    plt.show()

if __name__ == "__main__":
    df_funcionarios, df_presencas = load_data()
    df = clean_data(df_funcionarios, df_presencas)
    generate_plots(df, df_funcionarios)
