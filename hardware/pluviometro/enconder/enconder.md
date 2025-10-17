# ENCODER

## Descrição básica

Um encoder é um sensor eletromecânico utilizado para converter o movimento mecânico (geralmente a rotação de um eixo ou o deslocamento linear) em sinais elétricos digitais que representam posição, velocidade e direção. Ele atua como um “tradutor” entre o movimento físico e o sistema eletrônico de controle, permitindo que máquinas e controladores saibam exatamente onde e como um componente está se movendo. Normalmente, gera uma onda quadrada. Os encoders podem ser ópticos, magnéticos ou mecânicos, dependendo da forma como detectam o movimento.

Existem dois tipos principais de encoders:

- Encoder incremental: gera uma sequência de pulsos conforme o eixo gira. Cada pulso indica um pequeno avanço no movimento. A contagem desses pulsos permite determinar velocidade e distância percorrida, enquanto a defasagem entre dois sinais principais (A e B) que estão defasados em 90° permite identificar o sentido do movimento: se o sinal A adianta o B, o eixo está girando em um sentido; se o B adianta o A, está girando no sentido oposto. Ao contar os pulsos de A (ou B), o controlador calcula quanto o eixo se moveu. Se existir o pulso Z (index), ele marca o início de uma volta completa, servindo como ponto de referência para zerar ou sincronizar a contagem.

- Encoder absoluto: fornece um código binário único para cada posição do eixo. Assim, mesmo que o sistema seja desligado, ao religar ele “sabe” imediatamente em que posição está, sem necessidade de recalibração.

## Pinagem

Para o caso de um Enconder Incremental (provavelmente o usado), a pinagem pode variar de 4 a 6 pinos, sendo eles: VCC, GND, A e B (obrigatórios), tendo Z e CASE (aterramento e proteção contra ruido elétrico) como opcionais.

## Programação

O controlador pode usar temporizadores internos ou interrupções para medir tempo entre pulsos e calcular a velocidade do movimento.

---