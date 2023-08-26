import numpy as np
import cv2

def find_coords(image: np.ndarray) -> tuple[list[tuple[float]], list[tuple[float]]]:
    # Convertir imagen a escala de grises
    # contrast_image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Filtro Gaussiano
    # blur = cv2.GaussianBlur(gray_image, (5, 5), 0)
    # Umbral adaptativo para binarizar la imagen
    # _, binary_image = cv2.threshold(gray_image, 200, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Se binariza la imagen manualmente en base a la media del valor de los pixeles
    mean = np.mean(gray_image)
    binary_image = np.asarray((gray_image >= mean) * 255, dtype='uint8')
    # Se invierte la imagen para obtener los componentes
    binary_image = cv2.bitwise_not(binary_image)

    # Encontrar contornos de las pelotas y la meta
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)


    # Extract the coordinates of the centers of the contours
    ball_coordinates = []
    target_coordinates = []

    # El componente con mayor área es el recuadro
    max_area = np.max([cv2.contourArea(c) for c in contours])
    mean_area = np.mean([cv2.contourArea(c) for c in contours])

    for contour in contours:
        moment = cv2.moments(contour)
        cx = int(moment["m10"] / moment["m00"])
        cy = int(moment["m01"] / moment["m00"])
        # Por lo que se descarta de las pelotas
        if cv2.contourArea(contour) > mean_area:
            target_coordinates.append(np.array((cx, cy)))
        else:
            ball_coordinates.append(np.array((cx, cy)))

    return ball_coordinates, target_coordinates

def show_solution(image_reference, ball_coords, target_coords=None):
    # Visualiza la mejor solución
    result_image = np.copy(image_reference)
    for ball in ball_coords:
        x, y = ball.astype(int)
        cv2.circle(result_image, (x, y), 5, (0, 0, 255), -1)

    if target_coords:
        for goal in target_coords:
            x, y = goal.astype(int)
            cv2.circle(result_image, (x, y), 5, (0, 255, 0), -1)

    # Muestra la imagen con las coordenadas optimizadas
    while True:
        cv2.imshow("Resultado", result_image)
        if cv2.waitKey(33) == 27:
            break
    cv2.imwrite('output.png', result_image)
    cv2.destroyAllWindows()
