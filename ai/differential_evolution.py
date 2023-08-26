import cv2
import numpy as np
import matplotlib.pyplot as plt

from find_coords import find_coords, show_solution
from save_JSON import save_JSON
from calc_distances import calc_distance

# Sección a trabajar
CURRENT_SECTION = 1
DISTANCE_METHOD = 'euclidean'

# Se carga imagen
I = cv2.imread(f'img/play/Seccion{CURRENT_SECTION}.png')

# Obtener límites del recuadro de la imagen
height, width, _ = I.shape
x_limit = width - 1
y_limit = height - 1

# Se obtienen coordenadas de las pelotas y de la meta
balls_coords, target_coords = find_coords(I)
target_coords = target_coords[0]

# Calculo de todas las distancias para saber la relación entre ellas
distances = {'euclidean': [], 'cityblock': []}
for i in range(5):
    I_section = cv2.imread(f'img/play/Seccion{i+1}.png')
    balls, target = find_coords(I_section)
    distances['euclidean'].append(
        calc_distance(balls, target[0], 'euclidean'))
    distances['cityblock'].append(
        calc_distance(balls, target[0], 'cityblock'))

min_distance = np.min(distances[DISTANCE_METHOD])
max_distance = np.max(distances[DISTANCE_METHOD])
diff_distance = max_distance - min_distance

section_distance = calc_distance(balls_coords, target_coords)
target_distance = section_distance + \
    (diff_distance/8)  # Suma deseada de distancias

print('Distancia original:', section_distance)
print('Distancia objetivo:', target_distance)

# Define los parámetros del algoritmo de evolución diferencial
NUM_GENERATIONS = 5000
POPULATION_SIZE = 100
F_CONSTANT = 0.5
CR_CONSTANT = 0.7
PATTERN_WEIGHT = 0.9  # Peso para penalizar las diferencias del patrón original

# Genera la población inicial de posiciones aleatorias de las pelotas
# (population_size, num_balls, 2) -> (x, y)
num_balls = len(balls_coords)
population = np.random.rand(POPULATION_SIZE, num_balls, 2)

# Define los valores para la convergencia y el número máximo de generaciones
convergence_threshold = 1e-6
convergence_repeat = 10

# Variables de seguimiento de la convergencia
previous_best_objective = float('inf')
convergence_counter = 0

# Función objetivo: calcula la suma de distancias entre las pelotas y la meta,
# y penaliza las diferencias del patrón original y la cercanía entre pelotas
def objective_function(population, method=DISTANCE_METHOD):
    match method:
        case 'euclidean':
            distances = np.sqrt(
                np.sum((population - target_coords) ** 2, axis=1))
        case 'cityblock':
            distances = np.sum(np.abs(population - target_coords), axis=1)
    pattern_difference = np.sum(np.abs(population - balls_coords), axis=1)
    return np.abs(np.sum(distances) - target_distance) + PATTERN_WEIGHT * np.sum(pattern_difference)

# Listas para almacenar los valores de la mejor función objetivo en cada generación
best_objectives = []

# Ejecuta el algoritmo de evolución diferencial
for generation in range(NUM_GENERATIONS):
    for i in range(POPULATION_SIZE):
        candidates = np.random.choice(
            range(POPULATION_SIZE), size=3, replace=False)
        a, b, c = population[candidates]

        mutant = a + F_CONSTANT * (b - c)
        # Asegura que las coordenadas no sean negativas
        mutant = np.maximum(mutant, 0)

        # Ajusta las coordenadas si exceden los límites
        mutant[:, 0] = np.clip(mutant[:, 0], 0, x_limit)
        mutant[:, 1] = np.clip(mutant[:, 1], 0, y_limit)

        crossover = np.random.rand(num_balls, 2) < CR_CONSTANT
        candidate = np.where(crossover, mutant, population[i])

        candidate_objective = objective_function(candidate)
        current_objective = objective_function(population[i])

        if candidate_objective < current_objective:
            population[i] = candidate

    if (generation + 1) % 10 == 0:
        best_solution = population[np.argmin(
            [objective_function(p) for p in population])]
        best_objective = objective_function(best_solution)
        best_objectives.append(best_objective)
        print(
            f"Generación {generation+1}: Mejor objetivo = {best_objective}", end='\r')

        # Verifica la convergencia
        if abs(best_objective - previous_best_objective) < convergence_threshold:
            convergence_counter += 1
        else:
            convergence_counter = 0

        # Verifica la condición de parada
        if convergence_counter >= convergence_repeat:
            print("\nDeteniendo el algoritmo.")
            break

        previous_best_objective = best_objective

    if generation == NUM_GENERATIONS - 1:
        print("\nAlcanzado el número máximo de generaciones.")

best_solution = population[np.argmin(
    [objective_function(p) for p in population])]
save_JSON(best_solution, target_coords,
          f'json/predicted/Section{CURRENT_SECTION}.json')

print('Distancia alcanzada', calc_distance(best_solution, target_coords))

# Graficar la convergencia
plt.plot(best_objectives, marker='o')
plt.xlabel('Generación')
plt.ylabel('Mejor función objetivo')
plt.title('Convergencia del algoritmo de evolución diferencial')
plt.grid(True)
plt.savefig('plot.png')

show_solution(I, best_solution)
