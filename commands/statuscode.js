const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('statuscode')
        .setDescription('Retorna uma imagem de gato com um código de status HTTP.')
        .addStringOption(option =>
            option
                .setName('statuscode')
                .setDescription('O código de status HTTP que você deseja.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction;
        if (!options) return;
        const statusCode = options.getString('statuscode');

        try {
            const response = await axios.get(`https://http.cat/${statusCode}`, { timeout: 5000 /* tempo limite de 5 segundos */ });
            if (response.status === 200) {
                const embed = {
                    color: 0x0099ff,
                    description: `Quer saber mais sobre o status code ${statusCode}? Clique [**AQUI**](https://httpstatuses.com/${statusCode})`,
                    title: `HTTP Status Code: ${statusCode}`,
                    image: { url: `https://http.cat/${statusCode}` }
                    // footer: { text: 'Powered by http.cat', iconURL: 'https://http.cat/favicon.png' }
                };

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply(`Não foi possível obter uma imagem para o código de status ${statusCode}.`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(`Não foi possível obter uma imagem para o código de status ${statusCode}.`);
        }
    },
};
